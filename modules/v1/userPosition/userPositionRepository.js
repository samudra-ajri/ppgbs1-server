const { QueryTypes } = require('sequelize')
const db = require('../../../database/config/postgresql')
const positionTypesTableMap = require('../../../constants/positionTypesTableMap')

const userPositionRepository = {}

userPositionRepository.delete = async (userId, positionId, deletedBy) => {
    const data = { userId, positionId, deletedBy }
    await db.transaction(async (t) => {
        await deleteUserPosition(t, data)
        const userPositions = await findUserPositions(t, data)
        if (!userPositions.length) await deleteUser(t, data)
    })
}

userPositionRepository.undoDelete = async (userId, positionId) => {
    await db.transaction(async (trx) => {
        await undoDeleteUserPosition(trx, userId, positionId)
    })
}

const undoDeleteUserPosition = async (trx, userId, positionId) => {
    await db.query(`
        UPDATE "usersPositions"
        SET "deletedAt" = NULL
        WHERE "userId" = $1 AND "positionId" = $2`, {
            bind: [userId, positionId],
            type: QueryTypes.UPDATE,
            transaction: trx
        }
    )

    await db.query(`
        UPDATE users
        SET "deletedAt" = NULL, "deletedBy" = NULL, "isActive" = TRUE
        WHERE "id" = $1`, {
            bind: [userId],
            type: QueryTypes.UPDATE,
            transaction: trx
        }
    )
}

userPositionRepository.hardDelete = async (userId, positionId) => {
    await db.query(`
        DELETE FROM "usersPositions"
        WHERE "userId" = $1 AND "positionId" = $2`, {
            bind: [userId, positionId],
            type: QueryTypes.DELETE,
        }
    )
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

userPositionRepository.findDeletedUserPosition = async (userId, positionId) => {
    const [data] = await db.query(`
        SELECT 
            "usersPositions"."userId", 
            "usersPositions"."positionId"
        FROM 
            "usersPositions"
        WHERE 
            "usersPositions"."userId" = $1 
            AND "usersPositions"."positionId" = $2
            AND "usersPositions"."deletedAt" IS NOT NULL`, {
        bind: [userId, positionId],
        type: QueryTypes.SELECT,
    })
    return data
}

userPositionRepository.findPosition = async (positionId) => {
    const [data] = await db.query(`
        SELECT id, type
        FROM positions
        WHERE id = $1`, {
        bind: [positionId],
        type: QueryTypes.SELECT,
    })
    return data
}

userPositionRepository.findPositionByOrganization = async (organizationId, type) => {
    const [data] = await db.query(`
        SELECT
            positions.id,
            positions.name,
            positions.type,
            positions."organizationId",
            organizations.name as "organizationName"
        FROM positions
            LEFT JOIN organizations on organizations.id = positions."organizationId"
        WHERE positions."organizationId" = $1 AND positions.type = $2 AND positions."deletedAt" IS NULL`, {
        bind: [organizationId, type],
        type: QueryTypes.SELECT,
    })
    return data
}

userPositionRepository.countActiveUserPositions = async (userId) => {
    const [data] = await db.query(`
        SELECT count(*) as count
        FROM "usersPositions"
        WHERE "userId" = $1 AND "deletedAt" IS NULL`, {
        bind: [userId],
        type: QueryTypes.SELECT,
    })
    return Number(data.count)
}

userPositionRepository.findActiveUserPositionByType = async (userId, type) => {
    const [data] = await db.query(`
        SELECT
            positions.id as "positionId",
            positions.type,
            positions."organizationId"
        FROM
            "usersPositions"
            LEFT JOIN positions on positions.id = "usersPositions"."positionId"
        WHERE
            "usersPositions"."userId" = $1
            AND positions.type = $2
            AND "usersPositions"."deletedAt" IS NULL`, {
        bind: [userId, type],
        type: QueryTypes.SELECT,
    })
    return data
}

userPositionRepository.findUser = async (userId) => {
    const [data] = await db.query(`
        SELECT id, birthdate
        FROM users
        WHERE id = $1`, {
        bind: [userId],
        type: QueryTypes.SELECT,
    })
    return data
}

userPositionRepository.changeUserPosition = async (userId, positionId, newPositionId) => {
    const now = Date.now()
    await db.query(`
        UPDATE "usersPositions"
        SET "positionId" = $3, "createdAt" = $4
        WHERE "userId" = $1 AND "positionId" = $2`, {
            bind: [userId, positionId, newPositionId, now],
            type: QueryTypes.UPDATE
        }
    )
}

userPositionRepository.createUserPosition = async (userId, positionId, type) => {
    const now = Date.now()
    await db.query(`
        UPDATE "usersPositions"
        SET "positionId" = $3, "createdAt" = $4
        WHERE "userId" = $1 AND "positionId" = $2`, {
            bind: [userId, positionId, newPositionId, now],
            type: QueryTypes.UPDATE
        }
    )
}

userPositionRepository.createUserPosition = async (data) => {
    await db.transaction(async (t) => {
        await insertUserPosition(t, data)
        await insertUserRole(t, data)
    })
}

userPositionRepository.restoreUserPosition = async (data) => {
    const { userId, newPositionId } = data
    await db.transaction(async (t) => {
        await undoDeleteUserPosition(t, userId, newPositionId)
        await insertUserRole(t, data)
    })
}

userPositionRepository.createGenerusPosition = async (data) => {
    await db.transaction(async (t) => {
        await insertUserPosition(t, data)
        await upsertStudent(t, data)
    })
}

userPositionRepository.restoreGenerusPosition = async (data) => {
    const { userId, newPositionId } = data
    await db.transaction(async (t) => {
        await undoDeleteUserPosition(t, userId, newPositionId)
        await upsertStudent(t, data)
    })
}

const upsertStudent = async (trx, data) => {
    const { userId, grade } = data
    const now = Date.now()
    await db.query(`
        INSERT INTO students ("userId", "grade", "createdAt", "updatedAt", "updatedBy")
        VALUES ($1, $2, $3, $3, $1)
        ON CONFLICT ("userId") DO UPDATE
        SET "grade" = EXCLUDED."grade",
            "updatedAt" = EXCLUDED."updatedAt",
            "updatedBy" = EXCLUDED."updatedBy"`, {
            bind: [userId, grade, now],
            type: QueryTypes.INSERT,
            transaction: trx,
        }
    )
}

const insertUserPosition = async (trx, data) => {
    const { userId, newPositionId } = data
    const now = Date.now()
    await db.query(`
        INSERT INTO "usersPositions" ("userId", "positionId", "isMain", "createdAt")
        VALUES ($1, $2, $3, $4)`, {
            bind: [userId, newPositionId, false, now],
            type: QueryTypes.INSERT,
            transaction: trx,
        }
    )
}

const insertUserRole = async (trx, data) => {
    const { userId, type } = data
    const now = Date.now()
    const positionType = positionTypesTableMap[type]
    if (!positionType) return
    await db.query(`
        INSERT INTO ${positionType} ("userId", "createdAt", "updatedAt")
        VALUES ($1, $2, $2)
        ON CONFLICT ("userId") DO NOTHING`, {
            bind: [userId, now],
            type: QueryTypes.INSERT,
            transaction: trx,
        }
    )
}

module.exports = userPositionRepository
