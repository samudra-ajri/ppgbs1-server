const db = require('../../../database/config/postgresql')

const organizationRepository = {}

organizationRepository.findAll = async (filters, page, pageSize) => {
    let selectQuery = `
        SELECT organizations.id, organizations.name, organizations.level
    `
    let totalQuery = `
        SELECT count(DISTINCT organizations.id)
    `
    let baseJoinQuery = `
        FROM organizations
    `
    let filtersQuery = `
        WHERE "organizations"."deletedAt" IS NULL
    `

    if (filters?.level) filtersQuery += `
        AND organizations.level = ${Number(filters.level)}
    `

    if (filters?.ancestorId) {
        baseJoinQuery += `
            LEFT JOIN "organizationHierarchies" on organizations.id = "organizationHierarchies"."descendantId"
        `
        filtersQuery += `
            AND "organizationHierarchies"."ancestorId" = ${Number(filters.ancestorId)}
        `
    }

    const query = selectQuery + baseJoinQuery + filtersQuery + paginateQuery(page, pageSize)
    const queryTotal = totalQuery + baseJoinQuery + filtersQuery
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = () => {
    return `
        SELECT 
            organizations.id, 
            organizations.name, 
            organizations.level
        FROM organizations
    `
}

const totalQuery = () => {
    return `
        SELECT count(DISTINCT organizations.id)
        FROM organizations
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
    filter += filterBylevel(filters)
    return filter
}

const filterByDefault = () => {
    return `
        WHERE "organizations"."deletedAt" IS NULL
    `
}

const filterBylevel = (filters) => {
    let { level } = filters
    if (level) return `
        AND organizations.level = ${Number(level)}
    `
    return ''
}

module.exports = organizationRepository
