const { Readable } = require('stream')
const QueryStream = require('pg-query-stream')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const presenceRepository = {}

presenceRepository.insertPresence = async (data) => {
    const { userId, eventId, status, createdBy } = data
    const now = Date.now()
    await db.query(`
        INSERT INTO "presences" ("userId", "eventId", status, "createdBy", "createdAt")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("userId", "eventId") 
        DO UPDATE SET 
            status = EXCLUDED.status,
            "createdBy" = EXCLUDED."createdBy",
            "createdAt" = EXCLUDED."createdAt"`, 
        {
            bind: [userId, eventId, status, createdBy, now],
            type: QueryTypes.INSERT,
        }
    )
}

presenceRepository.findEvent = async (eventId) => {
    const [data] = await db.query(`
        SELECT id, passcode, name FROM events WHERE "id" = $1`, {
            bind: [eventId],
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
    return`
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
    return filter
}

const filterByDefault = (filters) => {
    const { eventId } = filters
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

const filterByOrganizationId = (filters) => {
    const { organizationId } = filters
    if (organizationId) {
        return `
            AND organizations.id::text LIKE '${Number(organizationId)}%'
        `
    }
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
            users.name as "userName",
            CASE users.sex
                WHEN 1 THEN 'L'
                WHEN 0 THEN 'P'
            END as "userSex",
            organizations.name as "organizationName", 
            ancestors.name as "ancestorOrgName"
        FROM presences
            LEFT JOIN users on users.id = presences."userId"
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

module.exports = presenceRepository
