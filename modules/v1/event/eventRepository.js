const positionTypesConstant = require('../../../constants/positionTypesConstant')
const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const eventRepository = {}

eventRepository.insertEvent = async (data) => {
    const { createdBy, organizationId, roomId, name, passcode, startDate, endDate, location, description } = data
    const now = Date.now()
    await db.query(`
        INSERT INTO "events" ("organizationId", "roomId", "name", "passcode", "startDate", "endDate", "location", "description", "createdBy", "updatedBy", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $10)
        RETURNING id`, {
            bind: [organizationId, roomId, name, passcode, startDate, endDate, location, description, createdBy, now],
            type: QueryTypes.INSERT,
        }
    )
}

eventRepository.findById = async (id) => {
    const query = selectQuery() + filterById()
    const [data] = await db.query(query, {
        bind: [id],
        type: QueryTypes.SELECT,
    })
    return data
}

eventRepository.findAll = async (session, filters, search, page, pageSize) => {
    const query = selectQuery() + filtersQuery(session, filters) + searchQuery(search) + orderBy() + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + filtersQuery(session, filters) + searchQuery(search)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = () => {
    return `
        SELECT 
            id, 
            "organizationId", 
            name,
            "roomId",
            "passcode", 
            "startDate",
            "endDate",
            location,
            description,
            "createdBy"
        FROM events
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

module.exports = eventRepository
