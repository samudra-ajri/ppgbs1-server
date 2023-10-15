const { QueryTypes } = require('sequelize')
const db = require('../../../database/config/postgresql')

const positionRepository = {}

positionRepository.findAll = async (filters, page, pageSize) => {
    const query = selectQuery() + filtersQuery(filters) + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + filtersQuery(filters)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = () => {
    return `
        SELECT 
            positions.id, 
            positions.name, 
            positions.type,
            positions."organizationId"
        FROM positions
    `
}

const totalQuery = () => {
    return `
        SELECT count(DISTINCT positions.id)
        FROM positions
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
    let filter = filterByDefault()
    filter += filterByOrganizationId(filters)
    return filter
}

const filterByDefault = () => {
    return `
        WHERE "positions"."deletedAt" IS NULL
    `
}

const filterByOrganizationId = (filters) => {
    let { organizationId } = filters
    if (organizationId) return `
        AND positions."organizationId" = ${Number(organizationId)}
    `
    return ''
}

module.exports = positionRepository
