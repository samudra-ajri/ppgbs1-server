const { QueryTypes } = require('sequelize')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const db = require('../../../database/config/postgresql')
const positionTypesTableMap = require('../../../constants/positionTypesTableMap')

const userPositionRepository = {}

userPositionRepository.delete = async (userId, positionId, deletedBy, type) => {
    const data = { userId, positionId, deletedBy, type }
    await db.transaction(async (t) => {
        await deleteUserPosition(t, data)
        await deleteUserRole(t, data)
        const userPositions = await findUserPositions(t, data)
        if (!userPositions.length) await deleteUser(t, data)
    })
}

const deleteUserPosition = async (trx, data) => {
    const { userId, positionId } = data
    const now = Date.now()
    await db.query(`
        UPDATE "usersPositions"
        SET "deletedAt" = $3
        WHERE "userId" = $1 AND "positionId" = $2`, {
            bind: [userId, positionId, now],
            type: QueryTypes.UPDATE,
            transaction: trx
        }
    )
}

const deleteUserRole = async (trx, data) => {
    const { userId, deletedBy, type } = data
    const now = Date.now()
    const positionType = positionTypesTableMap[type]
    await db.query(`
        UPDATE ${positionType} 
        SET "deletedAt" = $2, "deletedBy" = $3
        WHERE "userId" = $1`, {
            bind: [userId, now, deletedBy],
            type: QueryTypes.UPDATE,
            transaction: trx
        }
    )
}

const findUserPositions = async (trx, data) => {
    const { userId } = data
    const [usersPositions] = await db.query(`
        SELECT "userId"
        FROM "usersPositions"
        WHERE "userId" = $1 AND "deletedAt" IS NULL`, {
            bind: [userId],
            type: QueryTypes.UPDATE,
            transaction: trx
        }
    )
    return usersPositions
}

const deleteUser = async (trx, data) => {
    const { userId, deletedBy } = data
    const now = Date.now()
    await db.query(`
        UPDATE users
        SET "deletedAt" = $2, "deletedBy" = $3, "isActive" = false
        WHERE "id" = $1`, {
            bind: [userId, now, deletedBy],
            type: QueryTypes.UPDATE,
            transaction: trx
        }
    )
}

userPositionRepository.findUserPosition = async (userId, positionId) => {
    const [data] = await db.query(`
        SELECT 
            "usersPositions"."userId", 
            "usersPositions"."positionId",
             positions.type
        FROM 
            "usersPositions"
            LEFT JOIN positions on positions.id = "usersPositions"."positionId"
        WHERE 
            "usersPositions"."userId" = $1 
            AND "usersPositions"."positionId" = $2
            AND "usersPositions"."deletedAt" IS NULL`, {
        bind: [userId, positionId],
        type: QueryTypes.SELECT,
    })
    return data
}

module.exports = userPositionRepository
