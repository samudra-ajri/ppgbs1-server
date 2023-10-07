const { QueryTypes } = require('sequelize')
const db = require('../../../database/config/postgresql')

const materialRepository = {}

materialRepository.find = async (id) => {
    const [data] = await db.query(`
        SELECT id, material, grade, subject, category, subcategory
        FROM materials
        WHERE id = $1`, {
            bind: [id],
            type: QueryTypes.SELECT,
        }
    )
    return data
}

materialRepository.findAll = async (filters, page, pageSize) => {
    const query = selectQuery() + filtersQuery(filters) + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + filtersQuery(filters)
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
            materials.id, materials.material, materials.grade, materials.subject, materials.category, materials.subcategory
        FROM materials
    `
}

const totalQuery = () => {
    return `
        SELECT count(1)
        FROM materials
    `
}

const filtersQuery = (filters) => {
    let filter = filterByDefault()
    filter += filterByGrade(filters)
    filter += filterBySubject(filters)
    filter += filterByCategory(filters)
    filter += filterBySubcategory(filters)
    return filter
}

const filterByDefault = () => {
    return `
        WHERE materials."deletedAt" IS NULL
    `
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


module.exports = materialRepository
