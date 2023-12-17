const positionTypesConstant = require('../../../constants/positionTypesConstant')
const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const presenceRepository = {}

presenceRepository.insertPresence = async (data) => {
    const { userId, eventId, status, createdBy } = data
    const now = Date.now()
    await db.query(`
        INSERT INTO "presences" ("userId", "eventId", status, "createdBy", "createdAt")
        VALUES ($1, $2, $3, $4, $5)`, {
            bind: [userId, eventId, status, createdBy, now],
            type: QueryTypes.INSERT,
        }
    )
}

presenceRepository.findEvent = async (eventId) => {
    const [data] = await db.query(`
        SELECT id, passcode FROM events WHERE "id" = $1`, {
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
    const query = selectQuery() + baseJoinQuery() + filtersQuery(filters) + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + baseJoinQuery() + filtersQuery(filters)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = () => {
    return `
        SELECT 
            presences."userId", presences."eventId", presences.status, presences."createdAt",
            users.name as "userName", users.sex as "userSex", organizations.id as "organizationId", organizations.name as "organizationName"
    `
}

const totalQuery = () => {
    return `
        SELECT count(1)
    `
}

const baseJoinQuery = () => {
    return`
        FROM presences
        LEFT JOIN users on users.id = presences."userId"
        LEFT JOIN "usersPositions" on users.id = "usersPositions"."userId"
        LEFT JOIN positions on positions.id = "usersPositions"."positionId"
        LEFT JOIN organizations on organizations.id = "positions"."organizationId"
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
            AND organizations.id = ${Number(organizationId)}
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

presenceRepository.deletePresence = async (eventId, userId, deletedBy) => {
    const now = Date.now()
    await db.query(`
        UPDATE "presences"
        SET "deletedBy" = $3, "deletedAt" = $4
        WHERE "userId" = $1 AND "eventId" = $2`, {
            bind: [userId, eventId, deletedBy, now],
            type: QueryTypes.UPDATE
        }
    )
}

module.exports = presenceRepository
