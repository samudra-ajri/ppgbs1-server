const organizationLevelsConstant = require('../../../constants/organizationLevelsConstant')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const presenceStatusConstant = require('../../../constants/presenceStatusConstant')
const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const eventRepository = {}

eventRepository.insertEvent = async (data) => {
    const { session, grades, defaultPresenceStatus } = data

    const eventId = await db.transaction(async (t) => {
        const [event] = await createEvent(t, data)
        const users = grades.length ? await getUsers(t, session, grades) : []

        const userIds = users.map(user => user.id)
        const eventId = event[0].id
        if (userIds.length) await createPresencesList(t, session, userIds, eventId, defaultPresenceStatus)
        return eventId
    })

    return eventId
}

eventRepository.findById = async (session, id) => {
    const query = selectQuery(session) + filterById()
    const [data] = await db.query(query, {
        bind: [id],
        type: QueryTypes.SELECT,
    })
    return data
}

eventRepository.findAll = async (session, filters, search, page, pageSize, order) => {
    const query = selectQuery(session) + filtersQuery(session, filters) + searchQuery(search) + orderBy(order) + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + filtersQuery(session, filters) + searchQuery(search)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = (session) => {
    return `
        SELECT 
            events.id, 
            events."organizationId", 
            organizations.name as "organizationName", 
            organizations.level as "organizationLevel",
            events.name,
            events."roomId",
            events."startDate",
            events."endDate",
            events.location,
            events.description,
            ${session?.position.type === positionTypesConstant.GENERUS ? '' : '"passcode",'}
            events."createdBy",
            events."groupId",
            events."isGroupHead"
        FROM events
        LEFT JOIN organizations on organizations.id = "events"."organizationId"
    `
}

const totalQuery = () => {
    return `
        SELECT count(DISTINCT events.id)
        FROM events
        LEFT JOIN organizations on organizations.id = "events"."organizationId"
    `
}

const searchQuery = (search) => {
    if (search) return `
        AND (events.name ILIKE '%${search}%' OR organizations.name ILIKE '%${search}%')
    `
    return ''
}

const paginateQuery = (page, pageSize) => {
    page = parseInt(page) || 1
    pageSize = parseInt(pageSize) || 20
    const offset = (pageSize * page) - pageSize
    return `
        LIMIT ${pageSize} OFFSET ${offset}
    `
}

const orderBy = (order) => {
    if (order) {
        return `
            ORDER BY ${order}
        `
    }

    return `
        ORDER BY "startDate" DESC
    `
}

const filtersQuery = (session, filters) => {
    let filter = filterByDefault()
    filter += filterByOrganizationIds(filters)
    filter += filterByRoomId(filters)
    filter += filterBySession(session)
    filter += filterByGroupId(filters)
    filter += filterByIsGroupHead(filters)
    return filter
}

const filterByDefault = () => {
    return `
        WHERE events."deletedAt" IS NULL
    `
}

const filterByOrganizationIds = (filters) => {
    let { organizationIds } = filters
    if (organizationIds?.length) return `
        AND events."organizationId" IN (${organizationIds})
    `
    return ''
}

const filterByRoomId = (filters) => {
    let { roomId } = filters
    if (roomId) return `
        AND events."roomId" = '${Number(roomId)}'
    `
    return ''
}

const filterBySession = (session) => {
    if (session.position.type === positionTypesConstant.GENERUS) {
        return `
            AND events."organizationId" IN (
                SELECT "ancestorId"
                FROM "organizationHierarchies"
                WHERE "descendantId" = ${session.position.orgId}
            )
        `
    } else {
        return `
            AND events."organizationId" IN (${findMyHierarchyQuery(session.position.orgId)})
        `
    }
}

const filterById = () => {
    return `
        WHERE events.id = $1
    `
}

const filterByGroupId = (filters) => {
    let { groupId } = filters
    if (groupId === 'null') return `
        AND events."groupId" IS NULL
    `
    if (groupId) return `
        AND events."groupId" = '${Number(groupId)}'
    `
    return ''
}

const filterByIsGroupHead = (filters) => {
    let { isGroupHead } = filters
    if (isGroupHead === 'true') return `
        AND events."isGroupHead" = TRUE
    `
    if (isGroupHead === 'false') return `
        AND events."isGroupHead" = FALSE
    `
    return ''
}

// find ancestors and descendants ids based on session orgId
const findMyHierarchyQuery = (orgId) => {
    return `
        WITH Ancestors AS (
            SELECT "ancestorId" AS "orgId"
            FROM "organizationHierarchies"
            WHERE "descendantId" = ${orgId}
        ),
        Descendants AS (
            SELECT "descendantId" AS "orgId"
            FROM "organizationHierarchies"
            WHERE "ancestorId" = ${orgId} AND "descendantId" <> ${orgId}
        )
        
        SELECT "orgId" FROM Ancestors
        UNION ALL
        SELECT "orgId" FROM Descendants
    `
}

eventRepository.deleteEvent = async (createdBy, eventId) => {
    const now = Date.now()
    await db.query(`
        UPDATE "events"
        SET "deletedAt" = $3, "deletedBy" = $2
        WHERE "id" = $1 AND "createdBy" = $2`, {
        bind: [eventId, createdBy, now],
        type: QueryTypes.UPDATE
    }
    )
}

const createEvent = async (trx, data) => {
    const { session, roomId, name, passcode, startDate, endDate, location, description, grades } = data
    const now = Date.now()

    return db.query(`
        INSERT INTO "events" ("organizationId", "roomId", "name", "passcode", "startDate", "endDate", "location", "description", "createdBy", "updatedBy", "createdAt", "updatedAt", "organizationName", "grades")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $10, $11, $12)
        RETURNING id`, {
        bind: [session.position.orgId, roomId, name, passcode, startDate, endDate, location, description, session.id, now, session.position.orgName, grades],
        type: QueryTypes.INSERT,
        transaction: trx,
    }
    )
}

const getUsers = async (trx, session, grades) => {
    const selectQuery = `
        SELECT users.id FROM users
            RIGHT JOIN students ON users.id = students."userId"
            RIGHT JOIN "usersPositions" ON users.id = "usersPositions"."userId"
            LEFT JOIN positions ON positions.id = "usersPositions"."positionId"
    `

    let filterQuery = `
        WHERE "usersPositions"."deletedAt" IS NULL
            AND students.grade IN (:grades)
            AND positions.type = :positionType
    `

    const filters = { grades, positionType: positionTypesConstant.GENERUS }

    if (session.position.orgLevel !== organizationLevelsConstant.ppg) {
        filterQuery += `
            AND positions."organizationId"::text LIKE :organizationId
        `
        filters.organizationId = `${session.position.orgId}%`
    }

    const query = selectQuery + filterQuery + ';'
    return db.query(query, {
        replacements: filters,
        type: QueryTypes.SELECT,
        transaction: trx,
    })
}

const createPresencesList = async (trx, session, userIds, eventId, defaultPresenceStatus) => {
    const now = Date.now()
    const createdBy = session.id
    const status = (defaultPresenceStatus || defaultPresenceStatus === '') ? defaultPresenceStatus : presenceStatusConstant.ALPA

    const values = userIds.map((userId) =>
        `(${userId}, ${eventId}, '${status}', ${createdBy}, ${now})`
    ).join(',')

    await db.query(`
        INSERT INTO "presences" ("userId", "eventId", "status", "createdBy", "createdAt")
        VALUES ${values}`, {
        type: QueryTypes.INSERT,
        transaction: trx,
    }
    )
}

eventRepository.getEventPresences = async (eventId) => {
    return db.query(`
        SELECT 
            p."userId",
            p."eventId",
            p."status" "presenceStatus",
            p."createdAt" "presenceCreatedAt",

            e."name" "eventName",
            e."startDate" "eventStartDate",
            e."endDate" "eventEndDate",
            e."organizationName" "eventOrganizationName",
            e."grades" "eventGrades",

            u."name" "userName",
            CASE u.sex
                WHEN 1 THEN 'L'
                WHEN 0 THEN 'P'
            END as "userGander",
            u."isMuballigh" "userisMuballigh",
            
            CASE s."grade"
                WHEN 0 THEN 'Paud/TK'
                WHEN 1 THEN 'CR1'
                WHEN 2 THEN 'CR2'
                WHEN 3 THEN 'CR3'
                WHEN 4 THEN 'CR4'
                WHEN 5 THEN 'CR5'
                WHEN 6 THEN 'CR6'
                WHEN 7 THEN 'PR1'
                WHEN 8 THEN 'PR2'
                WHEN 9 THEN 'PR3'
                WHEN 10 THEN 'RM1'
                WHEN 11 THEN 'RM2'
                WHEN 12 THEN 'RM3'
                WHEN 13 THEN 'PN1'
                WHEN 14 THEN 'PN2'
                WHEN 15 THEN 'PN3'
                WHEN 16 THEN 'PN4'
            END as "userGrade",
            
            o."name" "PPK",
            oa."name" "PPD"
        FROM presences p
        LEFT JOIN events e ON p."eventId" = e.id
        LEFT JOIN users u ON p."userId" = u.id
        LEFT JOIN students s ON u.id = s."userId"
        LEFT JOIN "usersPositions" up ON u.id = up."userId"
        LEFT JOIN positions pos ON up."positionId" = pos.id
        LEFT JOIN organizations o ON pos."organizationId" = o.id
        LEFT JOIN organizations oa ON pos."ancestorOrgId" = oa.id
        WHERE p."eventId" = :eventId AND pos."type" = 'GENERUS';
    `, {
        replacements: { eventId },
        type: QueryTypes.SELECT
    })
}

eventRepository.findTop = async (session) => {
    return db.query(`
        WITH ranked_events AS (
            SELECT 
                id, 
                "organizationId", 
                name, 
                "roomId", 
                passcode, 
                "startDate", 
                "endDate", 
                location, 
                description, 
                "createdAt", 
                "createdBy", 
                "updatedAt", 
                "updatedBy", 
                "deletedAt", 
                "deletedBy", 
                "organizationName", 
                grades,
                ROW_NUMBER() OVER (PARTITION BY name ORDER BY id DESC) AS rn
            FROM events
            WHERE "organizationId" = :organizationId AND "deletedAt" IS NULL
        )
        SELECT *
        FROM ranked_events
        WHERE rn = 1
        ORDER BY id DESC
        LIMIT 10;
    `, {
        replacements: { organizationId: session.position.orgId },
        type: QueryTypes.SELECT
    })
}

module.exports = eventRepository
