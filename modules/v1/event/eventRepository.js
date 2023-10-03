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

module.exports = eventRepository
