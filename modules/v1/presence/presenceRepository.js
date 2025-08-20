const { Readable } = require('stream')
const QueryStream = require('pg-query-stream')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const presenceRepository = {}

presenceRepository.insertPresence = async (data) => {
    const { userId, eventId, status, createdBy, eventGroupId } = data
    const now = Date.now()
    await db.query(`
        INSERT INTO "presences" ("userId", "eventId", status, "createdBy", "createdAt", "groupId")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT ("userId", "eventId") 
        DO UPDATE SET 
            status = EXCLUDED.status,
            "createdBy" = EXCLUDED."createdBy",
            "createdAt" = EXCLUDED."createdAt"`,
        {
            bind: [userId, eventId, status, createdBy, now, eventGroupId],
            type: QueryTypes.INSERT,
        }
    )
}

presenceRepository.findEvent = async (eventId) => {
    const [data] = await db.query(`
        SELECT id, passcode, name, "groupId", "isGroupHead" FROM events WHERE "id" = $1`, {
        bind: [eventId],
        type: QueryTypes.SELECT,
    }
    )
    return data
}

presenceRepository.findGroupEvents = async (groupEventId) => {
    const data = await db.query(`
        SELECT id FROM events WHERE "groupId" = $1`, {
        bind: [groupEventId],
        type: QueryTypes.SELECT,
    }
    )
    return data
}

presenceRepository.findPresence = async (userId, eventId) => {
    const [data] = await db.query(`
        SELECT * FROM presences WHERE "userId" = $1 AND "eventId" = $2`, {
        bind: [userId, eventId],
        type: QueryTypes.SELECT,
    }
    )
    return data
}

presenceRepository.findPresenceGroup = async (userId, groupId) => {
    const data = await db.query(`
        SELECT "groupId" FROM presences WHERE status = 'HADIR' AND "userId" = $1 AND "groupId" = $2`, {
        bind: [userId, groupId],
        type: QueryTypes.SELECT,
    })
    return data
}

presenceRepository.findOneiWithUser = async (userId, eventId) => {
    const query = selectQuery() + baseJoinQuery() + filterByUserAndEventId()
    const [data] = await db.query(query, {
        bind: [userId, eventId],
        type: QueryTypes.SELECT,
    })
    return data
}

presenceRepository.findAll = async (filters, page, pageSize) => {
    const query = selectQuery() + baseJoinQuery() + filtersQuery(filters) + orderBy() + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + baseJoinQuery() + filtersQuery(filters)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = () => {
    return `
        SELECT 
            presences."userId", presences."eventId", presences.status, presences."createdAt", presences."createdBy", students.grade,
            users.name as "userName", users.sex as "userSex", organizations.id as "organizationId", organizations.name as "organizationName"
    `
}

const totalQuery = () => {
    return `
        SELECT 
            COUNT(1)::INTEGER AS total,
            COUNT(CASE WHEN presences.status = 'HADIR' THEN 1 END)::INTEGER AS hadir,
            COUNT(CASE WHEN presences.status = 'IZIN' THEN 1 END)::INTEGER AS izin,
            COUNT(CASE WHEN presences.status = 'ALPA' THEN 1 END)::INTEGER AS alpa
    `
}

const baseJoinQuery = () => {
    return `
        FROM presences
        LEFT JOIN users on users.id = presences."userId"
        LEFT JOIN students on students."userId" = users.id
        LEFT JOIN "usersPositions" on users.id = "usersPositions"."userId"
        LEFT JOIN positions on positions.id = "usersPositions"."positionId"
        LEFT JOIN organizations on organizations.id = "positions"."organizationId"
    `
}

const orderBy = () => {
    return `
        ORDER BY LOWER(users."name")
    `
}

const paginateQuery = (page, pageSize) => {
    page = parseInt(page) || 1
    pageSize = parseInt(pageSize) || 20
    const offset = (pageSize * page) - pageSize
    return `
        LIMIT ${pageSize} OFFSET ${offset}
    `
}

const filtersQuery = (filters) => {
    let filter = filterByDefault(filters)
    filter += filterByUserSex(filters)
    filter += filterByOrganizationId(filters)
    filter += filterByAncestorOrganizationId(filters)
    filter += filterByAncestorOrganizationId(filters)
    filter += filterByUserId(filters)
    filter += filterByGrade(filters)
    return filter
}

const filterByDefault = (filters) => {
    const { eventId, eventIds } = filters

    if (eventIds) {
        return `
            WHERE presences."eventId" IN (${eventIds})
            AND positions.type = '${positionTypesConstant.GENERUS}'
        `
    }

    return `
        WHERE presences."eventId" = ${Number(eventId)}
        AND positions.type = '${positionTypesConstant.GENERUS}'
    `
}

const filterByUserSex = (filters) => {
    const { sex } = filters
    if (sex) {
        return `
            AND users.sex = ${Number(sex)}
        `
    }
    return ''
}

const filterByUserId = (filters) => {
    const { userId } = filters
    if (userId) {
        return `
            AND users.id = ${Number(userId)}
        `
    }
    return ''
}

const filterByOrganizationId = (filters) => {
    const { organizationId } = filters
    if (organizationId) {
        return `
            AND organizations.id::text LIKE '${Number(organizationId)}%'
        `
    }
    return ''
}

const filterByGrade = (filters) => {
    let { grade } = filters
    if (grade) {
        const grades = grade.split(",").map(Number)
        return `
            AND students.grade IN (` + grades + `)
        `}
    return ''
}

const filterByUserAndEventId = () => {
    return `
        WHERE presences."userId" = $1
        AND presences."eventId" = $2
    `
}

const filterByAncestorOrganizationId = (filters) => {
    let { ancestorOrganizationId } = filters
    if (ancestorOrganizationId) return `
        AND organizations.id in (
            SELECT "descendantId" FROM "organizationHierarchies" WHERE "ancestorId" = ${Number(ancestorOrganizationId)}
        )
    `
    return ''
}

presenceRepository.deletePresence = async (eventId, userId) => {
    await db.query(`
        DELETE FROM "presences"
        WHERE "userId" = $1 AND "eventId" = $2`, {
        bind: [userId, eventId],
        type: QueryTypes.DELETE
    }
    )
}

presenceRepository.update = async (data) => {
    const now = Date.now()
    await db.query(`
        UPDATE "presences"
        SET "status" = :status, "createdAt" = :createdAt
        WHERE "userId" = :userId AND "eventId" = :eventId`, {
        replacements: {
            status: data.status.toUpperCase(),
            userId: data.userId,
            eventId: data.eventId,
            createdAt: now,
        },
        type: QueryTypes.UPDATE
    }
    )
}

const selectQueryStream = () => {
    return `
        SELECT 
            to_timestamp(presences."createdAt" / 1000) as "createdAt",
            presences.status,
            users.name as "userName",
            students.grade,
            CASE users.sex
                WHEN 1 THEN 'L'
                WHEN 0 THEN 'P'
            END as "userSex",
            organizations.name as "organizationName", 
            ancestors.name as "ancestorOrgName"
        FROM presences
            LEFT JOIN users on users.id = presences."userId"
            LEFT JOIN students on students."userId" = users.id
            LEFT JOIN "usersPositions" on users.id = "usersPositions"."userId"
            LEFT JOIN positions on positions.id = "usersPositions"."positionId"
            LEFT JOIN organizations on organizations.id = "positions"."organizationId"
            LEFT JOIN organizations ancestors on ancestors.id = "positions"."ancestorOrgId"
    `
}

presenceRepository.queryStream = async (filters) => {
    const client = await db.connectionManager.getConnection()
    try {
        const query = selectQueryStream() + filtersQuery(filters) + orderBy()
        const queryStream = new QueryStream(query)
        const stream = client.query(queryStream)
        return Readable.from(stream)
    } catch (error) {
        throw error
    } finally {
        db.connectionManager.releaseConnection(client)
    }
}

presenceRepository.getEventPresence = async (eventId, userId) => {
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
            e."groupId" "eventGroupId",

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
        WHERE p."eventId" = :eventId AND p."userId" = :userId AND pos."type" = 'GENERUS';
    `, {
        replacements: { eventId, userId },
        type: QueryTypes.SELECT
    })
}

module.exports = presenceRepository
