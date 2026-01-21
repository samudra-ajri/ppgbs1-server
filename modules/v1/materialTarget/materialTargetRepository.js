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

module.exports = materialTargetRepository
