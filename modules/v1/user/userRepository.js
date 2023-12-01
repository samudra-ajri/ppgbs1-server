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

userRepository.updateUser = async (data) => {
    await db.transaction(async (t) => {
        await updateUserProfile(t, data)
        await updateUserPositions(t, data)
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
    const { userId, isMarried, pondok, kertosonoYear, firstDutyYear, timesDuties, greatHadiths, education } = data
    const now = Date.now()
    await db.query(`
        UPDATE teachers
        SET "isMarried" = $2, "pondok" = $3, "kertosonoYear" = $4, "firstDutyYear" = $5, "timesDuties" = $6, "greatHadiths" = $7, "education" = $8, "updatedAt" = $9, "updatedBy" = $1
        WHERE "userId" = $1`, {
            bind: [userId, isMarried, pondok, kertosonoYear, firstDutyYear, timesDuties, greatHadiths, education, now],
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
    const query = selectQuery() + baseJoinQuery() + filtersQuery(filters) + searchQuery(search) + groupByQuery() + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + baseJoinQuery() + filtersQuery(filters) + searchQuery(search)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const selectQuery = () => {
    return `
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
                    'type', positions.type, 
                    'positionId', positions.id, 
                    'positionName', positions.name,
                    'organizationId', organizations.id,
                    'organizationName', organizations.name
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
    `
}

const groupByQuery = () => {
    return `
        GROUP BY
            users.id, 
            students.grade,
            teachers."isMarried",
            teachers.pondok,
            teachers."kertosonoYear",
            teachers."firstDutyYear",
            teachers."timesDuties",
            teachers."greatHadiths",
            teachers.education
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
    const { userId } = filters
    return `
        WHERE "usersPositions"."deletedAt" IS NULL
        AND users.id <> ${userId}
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
    if (grade) return `
        AND students.grade = ${Number(grade)}
    `
    return ''
}

const filterById = () => {
    return `
        WHERE users.id = $1
    `
}

module.exports = userRepository
