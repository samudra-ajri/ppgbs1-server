const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const authRepository = {}

authRepository.findUser = async (login) => {
    return db.query(`
        SELECT "id", "name", "isActive", "password", "resetPasswordToken"
        FROM "users" 
        WHERE "phone" = $1 OR "email" = $1 OR "username" = $1`, {
            bind: [login],
            type: QueryTypes.SELECT,
        }
    )
}

authRepository.findUserPoisition = async (userId, positionId) => {
    const positionFilter = positionId => {
        if (!positionId) return 'AND "isMain" = TRUE'
        return `AND "positionId" = ${Number(positionId)}`
    }

    const results = await db.query(`
        SELECT
            p."id" as "positionId", 
            p."name" as "positionName", 
            o."id" as "orgId",
            o."name" as "orgName",
            p."type"
        FROM "usersPositions" up
        JOIN "users" u on u."id" = up."userId"
        JOIN "positions" p on p."id" = up."positionId"
        JOIN "organizations" o on o."id" = p."organizationId"
        WHERE "userId" = $1 ${positionFilter(positionId)}`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )

    return results[0]
}

authRepository.findPoisitionHierarchy = async (positionId) => {
    return db.query(`
        SELECT o."id", o."name"
        FROM "organizationHierarchies" oh 
        JOIN "organizations" o on oh."ancestorId" = o.id
        WHERE "descendantId" = $1::int`, {
            bind: [positionId],
            type: QueryTypes.SELECT,
        }
    )
}

module.exports = authRepository
