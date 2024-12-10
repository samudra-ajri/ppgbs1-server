const { Readable } = require('stream')
const QueryStream = require('pg-query-stream')
const { QueryTypes } = require('sequelize')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const db = require('../../../database/config/postgresql')

const userRepository = {}

userRepository.findById = async (id) => {
    const query = selectQuery() + baseJoinQuery() + filterById() + groupByQuery()
    const [data] = await db.query(query, {
        bind: [id],
        type: QueryTypes.SELECT,
    })
    return data
}

userRepository.findByPhone = async (phone) => {
    const query = selectQuery() + baseJoinQuery() + filterByPhone() + groupByQuery()
    const [data] = await db.query(query, {
        bind: [phone],
        type: QueryTypes.SELECT,
    })
    return data
}

userRepository.updateUser = async (data) => {
    const { newPositionId } = data
    await db.transaction(async (t) => {
        await updateUserProfile(t, data)
        if (newPositionId) await updateUserPositions(t, data)
    })
}

const updateUserProfile = async (trx, data) => {
    const { id, name, phone, email, sex, isMuballigh, birthdate, password } = data
    const now = Date.now()
    await db.query(`
        UPDATE users
        SET "name" = $2, "sex" = $3, "isMuballigh" = $4, "birthdate" = $5, "password" = $6, "updatedAt" = $7, "phone" = $8, "email" = $9,"updatedBy" = $1
        WHERE "id" = $1`, {
            bind: [id, name, sex, isMuballigh, birthdate, password, now, phone, email],
            type: QueryTypes.UPDATE,
            transaction: trx,
        }
    )
}

const updateUserPositions = async (trx, data) => {
    const { id, currentPositionId, newPositionId } = data
    const now = Date.now()
    await db.query(`
        UPDATE "usersPositions"
        SET "positionId" = $3, "createdAt" = $4
        WHERE "userId" = $1 AND "positionId" = $2`, {
            bind: [id, currentPositionId, newPositionId, now],
            type: QueryTypes.UPDATE,
            transaction: trx,
        }
    )
}



userRepository.findUserStudent = async (userId) => {
    return db.query(`
        SELECT "userId"
        FROM "students" 
        WHERE "userId" = $1`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )
}

userRepository.updateUserStudent = async (data) => {
    const { userId, grade } = data
    const now = Date.now()
    await db.query(`
        UPDATE students
        SET "grade" = $2, "updatedAt" = $3, "updatedBy" = $1
        WHERE "userId" = $1`, {
            bind: [userId, grade, now],
            type: QueryTypes.UPDATE
        }
    )
}

userRepository.updateUserStudentByAdmin = async (data) => {
    const { userId, grade, updatedBy } = data
    const now = Date.now()
    await db.query(`
        UPDATE students
        SET "grade" = :grade, "updatedAt" = :updatedAt, "updatedBy" = :updatedBy
        WHERE "userId" = :userId`, {
            replacements: { userId, grade, updatedAt: now, updatedBy },
            type: QueryTypes.UPDATE
        }
    )
}

userRepository.findUserTeacher = async (userId) => {
    return db.query(`
        SELECT "userId"
        FROM "teachers" 
        WHERE "userId" = $1`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )
}

userRepository.updateUserTeacher = async (data) => {
    const { userId, pondok, kertosonoYear, firstDutyYear, timesDuties, greatHadiths, education } = data
    const now = Date.now()
    await db.query(`
        UPDATE teachers
        SET "pondok" = $2, "kertosonoYear" = $3, "firstDutyYear" = $4, "timesDuties" = $5, "greatHadiths" = $6, "education" = $7, "updatedAt" = $8, "updatedBy" = $1
        WHERE "userId" = $1`, {
            bind: [userId, pondok, kertosonoYear, firstDutyYear, timesDuties, greatHadiths, education, now],
            type: QueryTypes.UPDATE
        }
    )
}

userRepository.findUserPassword = async (id) => {
    const [data] = await db.query('SELECT password FROM users WHERE id = $1', {
        bind: [id],
        type: QueryTypes.SELECT,
    })
    return data
}

userRepository.findPositions = async (positionsIds) => {
    return db.query(
        'SELECT id, type FROM positions WHERE id = ANY($1::int[])', {
            bind: [positionsIds],
            type: QueryTypes.SELECT,
        }
    )
}

userRepository.findAll = async (filters, search, page, pageSize) => {
    const query = selectQuery() + baseJoinQuery() + filtersQuery(filters) + searchQuery(search) + groupByQuery() + orderByQuery() + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + baseJoinQuery() + filtersQuery(filters) + searchQuery(search)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

userRepository.queryStream = async (filters) => {
    const client = await db.connectionManager.getConnection()
    try {
        const query = selectQueryStream() + filtersQuery(filters) + groupByQuery() + orderByQuery()
        const queryStream = new QueryStream(query)
        const stream = client.query(queryStream)
        return Readable.from(stream)
    } catch (error) {
        throw error
    } finally {
        db.connectionManager.releaseConnection(client)
    }
}

const selectQueryStream = () => {
    return `
        SELECT 
            users.name, 
            users.email,
            users.phone,
            CASE users.sex
                WHEN 1 THEN 'L'
                WHEN 0 THEN 'P'
            END as "sex",
            users."isMuballigh",
            users.birthdate,
            students.grade,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'organizationName', organizations.name,
                    'ancestorOrgName', ancestors.name
                )
            ) as positions
        FROM users
            LEFT JOIN teachers on users.id = teachers."userId"
            LEFT JOIN students on users.id = students."userId"
            LEFT JOIN "usersPositions" on users.id = "usersPositions"."userId"
            LEFT JOIN positions on positions.id = "usersPositions"."positionId"
            LEFT JOIN organizations on organizations.id = "positions"."organizationId"
            LEFT JOIN organizations ancestors on ancestors.id = "positions"."ancestorOrgId"
    `
}

const selectQuery = () => {
    return `
        SELECT 
            users.id, 
            users.name, 
            users.email,
            users.username,
            users.phone,
            users."isActive", 
            users."lastLogin",
            users."resetPasswordToken",
            users.sex,
            users."isMuballigh",
            users.birthdate,
            users."needUpdatePassword",
            users."createdBy",
            students.grade,
            students."lastCompletionUpdate",
            teachers.pondok,
            teachers."kertosonoYear",
            teachers."firstDutyYear",
            teachers."timesDuties",
            teachers."greatHadiths",
            teachers.education,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'isMain', "usersPositions"."isMain",
                    'type', positions.type, 
                    'positionId', positions.id, 
                    'positionName', positions.name,
                    'organizationId', organizations.id,
                    'organizationName', organizations.name,
                    'ancestorOrgId', ancestors.id,
                    'ancestorOrgName', ancestors.name
                )
            ) as positions
    `
}

const totalQuery = () => {
    return `
        SELECT count(DISTINCT users.id)
    `
}

const baseJoinQuery = () => {
    return`
        FROM users
        LEFT JOIN teachers on users.id = teachers."userId"
        LEFT JOIN students on users.id = students."userId"
        LEFT JOIN "usersPositions" on users.id = "usersPositions"."userId"
        LEFT JOIN positions on positions.id = "usersPositions"."positionId"
        LEFT JOIN organizations on organizations.id = "positions"."organizationId"
        LEFT JOIN organizations ancestors on ancestors.id = "positions"."ancestorOrgId"
    `
}

const groupByQuery = () => {
    return `
        GROUP BY
            users.id, 
            students.grade,
            students."lastCompletionUpdate",
            teachers.pondok,
            teachers."kertosonoYear",
            teachers."firstDutyYear",
            teachers."timesDuties",
            teachers."greatHadiths",
            teachers.education
    `
}

const orderByQuery = () => {
    return `
        ORDER BY users.name
    `
}

const searchQuery = (search) => {
    if (search) return `
        AND users.name ILIKE '%${search}%'
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

const filtersQuery = (filters) => {
    let filter = filterByDefault(filters)
    filter += filterByActiveStatus(filters)
    filter += filterByOrganizationId(filters)
    filter += filterByForgotPasswordStatus(filters)
    filter += filterByAncestorId(filters)
    filter += filterBySex(filters)
    filter += filterByPositionType(filters)
    filter += filterByGrade(filters)
    return filter
}

const filterByDefault = (filters) => {
    const { userId, positionId, forgotPassword } = filters
    if (forgotPassword) return `
        WHERE positions.id IS NOT NULL
        AND NOT ("usersPositions"."userId" = ${userId} AND "usersPositions"."positionId" = ${Number(positionId)})
    `
    return `
        WHERE "usersPositions"."deletedAt" IS NULL
        AND positions.id IS NOT NULL
        AND NOT ("usersPositions"."userId" = ${userId} AND "usersPositions"."positionId" = ${Number(positionId)})
    `
}

const filterByActiveStatus = (filters) => {
    let { isActive } = filters
    if (isActive || isActive === false) return `
        AND "isActive" = ${isActive}
    `
    return ''
}

const filterByOrganizationId = (filters) => {
    let { organizationId } = filters
    if (organizationId) return `
        AND organizations.id = ${Number(organizationId)}
    `
    return ''
}

const filterByForgotPasswordStatus = (filters) => {
    let { forgotPassword } = filters
    if (forgotPassword === 'false') return `
        AND users."resetPasswordToken" IS NULL
    `
    if (forgotPassword === 'true') return `
        AND users."resetPasswordToken" IS NOT NULL
    `
    return ''
}

const filterByAncestorId = (filters) => {
    let { ancestorId } = filters
    if (ancestorId) return `
        AND organizations.id in (
            SELECT "descendantId" FROM "organizationHierarchies" WHERE "ancestorId" = ${Number(ancestorId)}
        )
    `
    return ''
}

const filterBySex = (filters) => {
    let { sex } = filters
    if (sex) return `
        AND users.sex = ${Number(sex)}
    `
    return ''
}

const filterByPositionType = (filters) => {
    let { positionType } = filters
    if (positionType) return `
        AND positions.type = '${positionTypesConstant[positionType]}'
    `
    return ''
}

const filterByGrade = (filters) => {
    let { grade } = filters
    if (grade) {
        const grades = grade.split(",").map(Number)
        return `
            AND students.grade IN (` + grades + `)
        `}
    return ''
}

const filterById = () => {
    return `
        WHERE users.id = $1
    `
}

const filterByPhone = () => {
    return `
        WHERE users.phone = $1
    `
}

module.exports = userRepository
