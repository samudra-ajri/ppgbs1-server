const { QueryTypes } = require('sequelize')
const db = require('../../../database/config/postgresql')

const directoryRepository = {}

directoryRepository.findByName = async (name) => {
    return db.query(`
        SELECT "name" FROM "directories" 
        WHERE "name" = :name`, {
        replacements: { name },
        type: QueryTypes.SELECT,
    }
    )
}

directoryRepository.insert = async (data) => {
    const { name, url } = data
    const now = Date.now()
    await db.query(`
        INSERT INTO "directories" ("name", "url", "createdAt", "updatedAt")
        VALUES (:name, :url, :now, :now)`, {
            replacements: { name, url, now },
            type: QueryTypes.INSERT,
        }
    )
}

directoryRepository.delete = async (id) => {
    await db.query(`
        DELETE FROM "directories"
        WHERE "id" = :id`, {
            replacements: { id },
            type: QueryTypes.DELETE,
        }
    )
}

directoryRepository.findAll = async (search, page, pageSize) => {
    const query = selectQuery() + filtersQuery() + searchQuery(search) + orderBy() + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + filtersQuery() + searchQuery(search)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = () => {
    return `
        SELECT *
        FROM directories
    `
}

const totalQuery = () => {
    return `
        SELECT count(DISTINCT directories.id)
        FROM directories
    `
}

const searchQuery = (search) => {
    if (search) return `
        AND directories.name ILIKE '%${search}%'
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
        ORDER BY "name" ASC
    `
}

const filtersQuery = () => {
    let filter = filterByDefault()
    return filter
}

const filterByDefault = () => {
    return `
        WHERE 1=1
    `
}

module.exports = directoryRepository
