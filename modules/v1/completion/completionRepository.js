const { QueryTypes } = require('sequelize')
const db = require('../../../database/config/postgresql')
const positionTypesConstant = require('../../../constants/positionTypesConstant')

const completionRepository = {}

completionRepository.findAll = async (filters, page, pageSize) => {
    const query = selectQuery() + baseJoinQuery() + filtersQuery(filters) + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + baseJoinQuery() + filtersQuery(filters)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const paginateQuery = (page, pageSize) => {
    page = parseInt(page) || 1
    pageSize = parseInt(pageSize) || 20
    const offset = (pageSize * page) - pageSize
    return `
        LIMIT ${pageSize} OFFSET ${offset}
    `
}

const selectQuery = () => {
    return `
        SELECT
            "usersCompletions"."userId", 
            "positions"."organizationId",
            "usersCompletions"."materialId",
            users.name "userName",
            materials.material,
            materials.grade,
            materials.subject,
            materials.category,
            materials.subcategory,
            organizations.name ppk
    `
}

const totalQuery = () => {
    return `
        SELECT count(1)
    `
}

const baseJoinQuery = () => {
    return`
        FROM "usersCompletions"
        INNER JOIN materials on "usersCompletions"."materialId" = materials.id
        INNER JOIN users on "usersCompletions"."userId" = users.id
        INNER JOIN "usersPositions" on users.id = "usersPositions"."userId"
        INNER JOIN "positions" on "usersPositions"."positionId" = positions.id
        LEFT JOIN "organizations" on "positions"."organizationId" = organizations.id
    `
}

const filtersQuery = (filters) => {
    let filter = filterByDefault()
    filter += filterByUserId(filters)
    filter += filterByMaterialId(filters)
    filter += filterByGrade(filters)
    filter += filterBySubject(filters)
    filter += filterByCategory(filters)
    filter += filterBySubcategory(filters)
    filter += filterByOrganization(filters)
    return filter
}

const filterByDefault = () => {
    return `
        WHERE 1 = 1
        AND positions.type = '${positionTypesConstant.GENERUS}'
    `
}

const filterByUserId = (filters) => {
    const { userId } = filters
    if (userId) {
        return `
            AND "usersCompletions"."userId" = ${Number(userId)}
        `
    }
    return ''
}

const filterByMaterialId = (filters) => {
    const { materialId } = filters
    if (materialId) {
        return `
            AND "usersCompletions"."materialId" = ${Number(materialId)}
        `
    }
    return ''
}

const filterByGrade = (filters) => {
    const { grade } = filters
    if (grade) {
        return `
            AND materials.grade = ${Number(grade)}
        `
    }
    return ''
}

const filterBySubject = (filters) => {
    const { subject } = filters
    if (subject) {
        return `
            AND materials.subject = '${subject}'
        `
    }
    return ''
}

const filterByCategory = (filters) => {
    const { category } = filters
    if (category) {
        return `
            AND materials.category = '${category}'
        `
    }
    return ''
}

const filterBySubcategory = (filters) => {
    const { subcategory } = filters
    if (subcategory) {
        return `
            AND materials.subcategory = '${subcategory}'
        `
    }
    return ''
}

const filterByOrganization = (filters) => {
    const { organizationId } = filters
    if (organizationId) {
        return `
            AND organizations.id = ${Number(organizationId)}
        `
    }
    return ''
}


module.exports = completionRepository
