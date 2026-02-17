const { QueryTypes } = require('sequelize')
const db = require('../../../database/config/postgresql')

const materialTargetRepository = {}

materialTargetRepository.bulkCreate = async (records) => {
    const values = records.map(record => `(
        ${record.materialId}, 
        ARRAY[${record.grades.join(',')}], 
        ${record.month}, 
        ${record.year}, 
        ${Date.now()}
    )`).join(', ')

    // Using ON CONFLICT to handle duplicates (if re-running for same month/material)
    // We update updatedAt and grades if it conflicts
    const now = Date.now()

    return db.query(`
        INSERT INTO "materialTargets" ("materialId", "grades", "month", "year", "createdAt")
        VALUES ${values}
        ON CONFLICT ("materialId", "month", "year") 
        DO UPDATE SET "updatedAt" = ${now}, "deletedAt" = NULL, "grades" = EXCLUDED."grades"
    `, {
        type: QueryTypes.INSERT
    })
}

materialTargetRepository.findAll = async (filters, page, pageSize) => {
    const { month, year, materialId, grade } = filters
    const offset = (page - 1) * pageSize
    let whereClause = 'WHERE mt."deletedAt" IS NULL'

    if (month) whereClause += ` AND "month" = ${month}`
    if (year) whereClause += ` AND "year" = ${year}`
    if (materialId) whereClause += ` AND "materialId" = ${materialId}`
    if (grade) whereClause += ` AND ${grade} = ANY("grades")`

    const countQuery = `SELECT COUNT(*) FROM "materialTargets" mt ${whereClause}`
    const dataQuery = `
        SELECT 
            mt.*,
            m.material,
            m.subject,
            m.category,
            m.subcategory
        FROM "materialTargets" mt
        LEFT JOIN materials m ON mt."materialId" = m.id
        ${whereClause}
        ORDER BY mt."year" DESC, mt."month" DESC, mt."createdAt" DESC
        LIMIT ${pageSize} OFFSET ${offset}
    `

    const total = await db.query(countQuery, { type: QueryTypes.SELECT })
    const data = await db.query(dataQuery, { type: QueryTypes.SELECT })

    return { data, total }
}

materialTargetRepository.findAllIds = async (filters) => {
    const { month, year, materialId, grade } = filters
    let whereClause = 'WHERE mt."deletedAt" IS NULL'

    if (month) whereClause += ` AND "month" = ${month}`
    if (year) whereClause += ` AND "year" = ${year}`
    if (materialId) whereClause += ` AND "materialId" = ${materialId}`
    if (grade) whereClause += ` AND ${grade} = ANY("grades")`

    const dataQuery = `
        SELECT mt.id
        FROM "materialTargets" mt
        ${whereClause}
        ORDER BY mt."year" DESC, mt."month" DESC, mt."createdAt" DESC
    `

    const data = await db.query(dataQuery, { type: QueryTypes.SELECT })
    return data.map(item => item.id)
}

materialTargetRepository.findById = async (id) => {
    const query = `
        SELECT * FROM "materialTargets"
        WHERE id = ${id} AND "deletedAt" IS NULL
    `
    const result = await db.query(query, { type: QueryTypes.SELECT })
    return result[0]
}

materialTargetRepository.update = async (id, data) => {
    const { grades, month, year } = data
    const now = Date.now()
    let setClause = `"updatedAt" = ${now}`

    if (grades) setClause += `, "grades" = ARRAY[${grades.join(',')}]`
    if (month) setClause += `, "month" = ${month}`
    if (year) setClause += `, "year" = ${year}`

    const query = `
        UPDATE "materialTargets"
        SET ${setClause}
        WHERE id = ${id}
    `
    await db.query(query, { type: QueryTypes.UPDATE })
}

materialTargetRepository.delete = async (id) => {
    const now = Date.now()
    const query = `
        UPDATE "materialTargets"
        SET "deletedAt" = ${now}
        WHERE id = ${id}
    `
    await db.query(query, { type: QueryTypes.UPDATE })
}

materialTargetRepository.group = async (filters) => {
    const { month, year } = filters || {}
    let whereClause = 'WHERE "deletedAt" IS NULL'

    if (month) whereClause += ` AND "month" = ${month}`
    if (year) whereClause += ` AND "year" = ${year}`

    const query = `
        SELECT grades, month, year, COUNT(1)::int AS "total" 
        FROM "materialTargets" 
        ${whereClause}
        GROUP BY grades, month, year
    `
    return await db.query(query, { type: QueryTypes.SELECT })
}

materialTargetRepository.countTargeted = async (structure, filters) => {
    let whereClause = 'WHERE mt."deletedAt" IS NULL AND materials."deletedAt" IS NULL'
    const { month, year } = filters || {}

    if (month) whereClause += ` AND mt."month" = ${month}`
    if (year) whereClause += ` AND mt."year" = ${year}`

    if (structure === 'material') {
        return db.query(`
            SELECT materials.id, materials.material, COUNT(mt."materialId") as count
            FROM "materialTargets" mt
            INNER JOIN materials ON mt."materialId" = materials.id
            ${whereClause}
            GROUP BY materials.material, materials.id
            ORDER BY materials.id`, {
            type: QueryTypes.SELECT,
        })
    } else {
        return db.query(`
            SELECT materials.${structure}, COUNT(mt."materialId") as count
            FROM "materialTargets" mt
            INNER JOIN materials ON mt."materialId" = materials.id
            ${whereClause}
            GROUP BY materials.${structure}
            ORDER BY materials.${structure}`, {
            type: QueryTypes.SELECT,
        })
    }
}

materialTargetRepository.countMaterials = async (structure) => {
    if (structure === 'material') {
        return db.query(`
            SELECT materials.id, materials.material, materials.grade, COUNT(materials.id) as count
            FROM materials
            WHERE materials."deletedAt" IS NULL
            GROUP BY materials.material, materials.grade, materials.id
            ORDER BY materials.id`, {
            type: QueryTypes.SELECT,
        })
    } else {
        return db.query(`
            SELECT materials.${structure}, COUNT(materials.id) as count
            FROM materials
            WHERE materials."deletedAt" IS NULL
            GROUP BY materials.${structure}
            ORDER BY materials.${structure}`, {
            type: QueryTypes.SELECT,
        })
    }
}

module.exports = materialTargetRepository
