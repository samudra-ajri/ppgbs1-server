const organizationLevelsConstant = require('../../../constants/organizationLevelsConstant')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const presenceStatusConstant = require('../../../constants/presenceStatusConstant')
const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const eventRepository = {}

eventRepository.insertEvent = async (data) => {
    const { session, grades } = data

    await db.transaction(async (t) => {
        const [event] = await createEvent(t, data)
        const users = await getUsers(t, session, grades)
        
        const userIds = users.map(user => user.id)
        const eventId = event[0].id
        await createPresencesList(t, session, userIds, eventId)
    })
}

eventRepository.findById = async (session, id) => {
    const query = selectQuery(session) + filterById()
    const [data] = await db.query(query, {
        bind: [id],
        type: QueryTypes.SELECT,
    })
    return data
}

eventRepository.findAll = async (session, filters, search, page, pageSize) => {
    const query = selectQuery(session) + filtersQuery(session, filters) + searchQuery(search) + orderBy() + paginateQuery(page, pageSize)
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
            ${session.position.type === positionTypesConstant.GENERUS ? '' : '"passcode",'}
            events."createdBy"
        FROM events
        LEFT JOIN organizations on organizations.id = "events"."organizationId"
    `
}

const totalQuery = () => {
    return `
        SELECT count(DISTINCT events.id)
        FROM events
    `
}

const searchQuery = (search) => {
    if (search) return `
        AND events.name ILIKE '%${search}%'
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

const orderBy = () => {
    return `
        ORDER BY "startDate" DESC
    `
}

const filtersQuery = (session, filters) => {
    let filter = filterByDefault()
    filter += filterByOrganizationIds(filters)
    filter += filterByRoomId(filters)
    filter += filterBySession(session)
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

const createPresencesList = async (trx, session, userIds, eventId) => {
    const now = Date.now()
    const createdBy = session.id
    const status = presenceStatusConstant.ALPHA

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

module.exports = eventRepository
