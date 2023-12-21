const positionTypesTableMap = require('../../../constants/positionTypesTableMap')
const db = require('../../../database/config/postgresql')

const { QueryTypes } = require('sequelize')

const authRepository = {}

authRepository.findUser = async (login) => {
    return db.query(`
        SELECT "id", "name", "isActive", "password", "resetPasswordToken"
        FROM "users" 
        WHERE "phone" = :login OR "email" = :login OR "username" = :login`, {
            replacements: { login },
            type: QueryTypes.SELECT,
        }
    )
}

authRepository.findUserByResetToken = async (token) => {
    return db.query(` SELECT "id", "password" FROM "users" WHERE "resetPasswordToken" = $1`, {
            bind: [token],
            type: QueryTypes.SELECT,
        }
    )
}

authRepository.updateLastLogin = async (userId) => {
    const now = Date.now()
    await db.query(`
        UPDATE users
        SET "lastLogin" = $2
        WHERE "id" = $1`, {
            bind: [userId, now],
            type: QueryTypes.UPDATE
        }
    )
}

authRepository.findRegisteredUser = async (register) => {
    // generate query filters based on register data
    const filters = []
    const bind = []
    let i = 1
    for (const key in register) {
        if (register[key]) {
            bind.push(register[key])
            filters.push(`${key} = $${i}`)
            i++
        }
    }
    const queryFilters = filters.join(' OR ')

    return db.query(`
        SELECT "id"
        FROM "users" 
        WHERE ${queryFilters}`, {
            bind,
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

authRepository.findUserWithPosition = async (userId) => {
    const user = await db.query(`
        SELECT 
        users.id, 
        users.name, 
        users.email,
        users.phone,
        users."isActive", 
        users."lastLogin",
        users."resetPasswordToken",
        users.sex,
        users."isMuballigh",
        users.birthdate,
        users."needUpdatePassword",
        students.grade,
        teachers."isMarried",
        teachers.pondok,
        teachers."kertosonoYear",
        teachers."firstDutyYear",
        teachers."timesDuties",
        teachers."greatHadiths",
        teachers.education, 
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'isMain', "usersPositions"."isMain",
                    'type', "positions"."type", 
                    'positionId', "positions"."id", 
                    'positionName', "positions"."name",
                    'organizationId', "organizations"."id",
                    'organizationName', "organizations"."name",
                    'organizationLevel', "organizations"."level"
                )
            ) as positions
        FROM users
        LEFT JOIN teachers on users.id = teachers."userId"
        LEFT JOIN students on users.id = students."userId"
        LEFT JOIN "usersPositions" on "users"."id" = "usersPositions"."userId"
        LEFT JOIN "positions" on "positions"."id" = "usersPositions"."positionId"
        LEFT JOIN "organizations" on "organizations"."id" = "positions"."organizationId"
        WHERE "users"."id" = $1
        GROUP BY
            users.id, 
            students.grade,
            teachers."isMarried",
            teachers.pondok,
            teachers."kertosonoYear",
            teachers."firstDutyYear",
            teachers."timesDuties",
            teachers."greatHadiths",
            teachers.education`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )

    return user[0]
}

authRepository.findPositions = async (positionsIds) => {
    return db.query(
        'SELECT id, type FROM positions WHERE id = ANY($1::int[])', {
            bind: [positionsIds],
            type: QueryTypes.SELECT,
        }
    )
}

authRepository.createUser = async (data) => {
    await db.transaction(async (t) => {
        const user = await insertUser(t, data)
        data.userId = user[0].id
        await insertUserPositions(t, data)
        await insertUserRoles(t, data)
    })
}

authRepository.updateResetPasswordToken = async (data) => {
    const { userId, resetPasswordToken } = data
    const now = Date.now()
    await db.query(`
        UPDATE users
        SET "resetPasswordToken" = $2, "updatedAt" = $3
        WHERE "id" = $1`, {
            bind: [userId, resetPasswordToken, now],
            type: QueryTypes.UPDATE
        }
    )
}

authRepository.tempUserPassword = async (data) => {
    const { token, password, updatedBy } = data
    const now = Date.now()
    await db.query(`
        UPDATE users
        SET "password" = $2, "updatedBy" = $3, "updatedAt" = $4, "needUpdatePassword" = true
        WHERE "resetPasswordToken" = $1`, {
            bind: [token, password, updatedBy, now],
            type: QueryTypes.UPDATE
        }
    )
}

authRepository.updateUserPassword = async (data) => {
    const { userId, password } = data
    const now = Date.now()
    await db.query(`
        UPDATE "users"
        SET "password" = $2, "updatedBy" = $3, "updatedAt" = $4, "resetPasswordToken" = null, "needUpdatePassword" = false
        WHERE id = $1`, {
            bind: [userId, password, userId, now],
            type: QueryTypes.UPDATE
        }
    )
}

authRepository.findCurrentAncestorOrganization = async (currentOrganizationId) => {
    const result = await db.query(`
        SELECT "ancestorId", "organizations"."name"
        FROM "organizationHierarchies"
        LEFT JOIN "organizations" on "organizations"."id" = "organizationHierarchies"."ancestorId"
        WHERE "descendantId" = $1 AND depth = 1`, {
            bind: [currentOrganizationId],
            type: QueryTypes.SELECT,
        }
    )

    return {
        organizationAncestorId: Number(result[0]?.ancestorId), 
        organizationAncestorName: result[0]?.name, 
    }
}

const insertUser = async (trx, data) => {
    const { name, phone, password, username, email, sex, isMuballigh, birthdate } = data
    const now = Date.now()
    const results = await db.query(`
        INSERT INTO "users" ("name", "phone", "password", "username", "email", "sex", "isMuballigh", "birthdate", "createdAt", "updatedAt", "isActive")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10)
        RETURNING id`, {
            bind: [name, phone, password, username, email, sex, isMuballigh, birthdate, now, true],
            type: QueryTypes.INSERT,
            transaction: trx,
        }
    )
    return results[0]
}

const insertUserPositions = async (trx, data) => {
    const { userId, positionIds } = data
    const now = Date.now()
    positionIds.forEach(async (positionId, index) => {
        const isMain = index === 0 ? true : false
        await db.query(`
            INSERT INTO "usersPositions" ("userId", "positionId", "isMain", "createdAt")
            VALUES ($1, $2, $3, $4)`, {
                bind: [userId, positionId, isMain, now],
                type: QueryTypes.INSERT,
                transaction: trx,
            }
        )
    })
}

const insertUserRoles = async (trx, data) => {
    const { userId, positions } = data
    const now = Date.now()

    for (let position of positions) {
        const positionType = positionTypesTableMap[position.type]
        const values = [userId, now, now]
        const placeholders = values.map((_, index) => `$${index + 1}`).join(',')
        await db.query(`
            INSERT INTO ${positionType} ("userId", "createdAt", "updatedAt")
            VALUES (${placeholders})`, {
                bind: values,
                type: QueryTypes.INSERT,
                transaction: trx,
            }
        )
    }
}

module.exports = authRepository
