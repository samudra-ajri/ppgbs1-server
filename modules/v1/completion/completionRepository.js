const { QueryTypes } = require('sequelize')
const db = require('../../../database/config/postgresql')
const positionTypesConstant = require('../../../constants/positionTypesConstant')

const completionRepository = {}

completionRepository.insert = async (userId, materialIds) => {
    const now = Date.now()
    const values = []
    materialIds.forEach(materialId => {
        values.push(`(${Number(userId)}, ${Number(materialId)}, ${now})`)
    })
    await db.query(`
        INSERT INTO "usersCompletions" ("userId", "materialId", "createdAt")
        VALUES ${values.join(', ')}`, {
            type: QueryTypes.INSERT,
        }
    )
}

completionRepository.findUsersCompletions = async (userId, materialIds) => {
    return db.query(`
        SELECT "materialId"
        FROM "usersCompletions"
        WHERE "userId" = $1 AND "materialId" = ANY($2::int[])`, {
            bind: [userId, materialIds],
            type: QueryTypes.SELECT,
        }
    )
}

completionRepository.findOneByUserId = async (userId) => {
    const [data] = await db.query(`
        SELECT "userId"
        FROM "usersCompletions"
        WHERE "userId" = $1`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )
    return data
}

completionRepository.delete = async (userId, materialIds) => {
    await db.query(`
        DELETE FROM "usersCompletions" 
        WHERE "userId" = $1 AND "materialId" = ANY($2::int[])`, {
            bind: [userId, materialIds],
            type: QueryTypes.DELETE,
        }
    )
}

completionRepository.findAll = async (filters, page, pageSize) => {
    const query = selectQuery() + baseJoinQuery() + filtersQuery(filters) + orderBy() + paginateQuery(page, pageSize)
    const queryTotal = totalQuery() + baseJoinQuery() + filtersQuery(filters)
    const [data] = await db.query(query)
    const [total] = await db.query(queryTotal)
    return { data, total }
}

const orderBy = () => {
    return `
        ORDER BY materials.id
    `
}

const paginateQuery = (page, pageSize) => {
    page = parseInt(page) || 1
    pageSize = parseInt(pageSize) || 20
    const offset = (pageSize * page) - pageSize
    return `
        LIMIT ${pageSize} OFFSET ${offset}
    `
}

const selectQuery = () => {
    return `
        SELECT
            "usersCompletions"."userId", 
            "positions"."organizationId",
            "usersCompletions"."materialId",
            users.name "userName",
            materials.material,
            materials.grade,
            materials.subject,
            materials.category,
            materials.subcategory,
            organizations.name ppk
    `
}

const totalQuery = () => {
    return `
        SELECT count(1)
    `
}

const baseJoinQuery = () => {
    return`
        FROM "usersCompletions"
        INNER JOIN materials on "usersCompletions"."materialId" = materials.id
        INNER JOIN users on "usersCompletions"."userId" = users.id
        INNER JOIN "usersPositions" on users.id = "usersPositions"."userId"
        INNER JOIN "positions" on "usersPositions"."positionId" = positions.id
        LEFT JOIN "organizations" on "positions"."organizationId" = organizations.id
    `
}

const filtersQuery = (filters) => {
    let filter = filterByDefault()
    filter += filterByPosition(filters)
    filter += filterByUserId(filters)
    filter += filterByMaterialId(filters)
    filter += filterByGrade(filters)
    filter += filterBySubject(filters)
    filter += filterByCategory(filters)
    filter += filterBySubcategory(filters)
    filter += filterByOrganization(filters)
    return filter
}

const sumFiltersQuery = (filters) => {
    let filter = filterByDefault()
    filter += filterByPosition(filters)
    filter += filterByGrade(filters)
    filter += filterBySubject(filters)
    filter += filterByCategory(filters)
    filter += filterBySubcategory(filters)
    filter += filterByOrganization(filters)
    filter += filterByUsersGrade(filters)
    return filter
}

const filterByDefault = () => {
    return `
        WHERE materials."deletedAt" IS NULL
    `
}

const filterByPosition = (filters) => {
    const { position } = filters
    if (position) {
        return `
            AND positions.type = '${position}'
        `
    }
    return ''
}

const filterByUserId = (filters) => {
    const { userId } = filters
    if (userId) {
        return `
            AND "usersCompletions"."userId" = ${Number(userId)}
        `
    }
    return ''
}

const filterByMaterialId = (filters) => {
    const { materialId } = filters
    if (materialId) {
        return `
            AND "usersCompletions"."materialId" = ${Number(materialId)}
        `
    }
    return ''
}

const filterByGrade = (filters) => {
    const { grade } = filters
    if (grade) {
        return `
            AND materials.grade = ${Number(grade)}
        `
    }
    return ''
}

const filterBySubject = (filters) => {
    const { subject } = filters
    if (subject) {
        return `
            AND materials.subject = '${subject}'
        `
    }
    return ''
}

const filterByCategory = (filters) => {
    const { category } = filters
    if (category) {
        return `
            AND materials.category = '${category}'
        `
    }
    return ''
}

const filterBySubcategory = (filters) => {
    const { subcategory } = filters
    if (subcategory) {
        return `
            AND materials.subcategory = '${subcategory}'
        `
    }
    return ''
}

const filterByOrganization = (filters) => {
    const { organizationId } = filters
    if (organizationId) {
        return `
            AND "positions"."organizationId" = ${Number(organizationId)}
        `
    }
    return ''
}

const filterByUsersGrade = (filters) => {
    const { usersGrade } = filters
    if (usersGrade) {
        return `
            AND "students"."grade" = ${Number(usersGrade)}
        `
    }
    return ''
}

completionRepository.findMaterials = async (materialIds) => {
    return db.query(
        'SELECT id FROM materials WHERE id = ANY($1::int[])', {
            bind: [materialIds],
            type: QueryTypes.SELECT,
        }
    )
}

// completion of a specific user
completionRepository.countUserCompletions = async (structure, userId, filters) => {
    return db.query(`
        SELECT materials.${structure}, COUNT("materialId") as count
        FROM "usersCompletions"
        INNER JOIN materials ON "usersCompletions"."materialId" = materials.id
        ${sumFiltersQuery(filters)}
        AND "usersCompletions"."userId" = $1
        GROUP BY materials.${structure}
        ORDER BY materials.${structure}`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )
}

completionRepository.countUserCompletionsWithId = async (userId, filters) => {
    return db.query(`
        SELECT materials.id, materials.material, COUNT("materialId") as count
        FROM "usersCompletions"
        INNER JOIN materials ON "usersCompletions"."materialId" = materials.id
        ${sumFiltersQuery(filters)}
        AND "usersCompletions"."userId" = $1
        GROUP BY materials.material, materials.id
        ORDER BY materials.material`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )
}

completionRepository.countUserCompletionsMaterials = async (structure, filtersInput) => {
    const { grade, subject, category, subcategory } = filtersInput
    const filters = { grade, subject, category, subcategory }
    return db.query(`
        SELECT materials.${structure}, COUNT(id) as count
        FROM materials
        ${sumFiltersQuery(filters)}
        GROUP BY materials.${structure}
        ORDER BY materials.${structure}`, {
            type: QueryTypes.SELECT,
        }
    )
}

completionRepository.countUserCompletionsMaterialsWithId = async (filtersInput) => {
    const { grade, subject, category, subcategory } = filtersInput
    const filters = { grade, subject, category, subcategory }
    return db.query(`
        SELECT materials.id, materials.material, COUNT(id) as count
        FROM materials
        ${sumFiltersQuery(filters)}
        GROUP BY materials.material, materials.id
        ORDER BY materials.material`, {
            type: QueryTypes.SELECT,
        }
    )
}

// completion of users
completionRepository.countUsersCompletions = async (structure, filters) => {
    let selectQuery = `
        SELECT materials.${structure}, COUNT("materialId") as count
    `
    let baseJoinQuery = `
        FROM "usersCompletions"
        INNER JOIN materials ON "usersCompletions"."materialId" = materials.id
        INNER JOIN users ON "usersCompletions"."userId" = users.id
        INNER JOIN "usersPositions" ON users.id = "usersPositions"."userId"
        INNER JOIN positions ON "usersPositions"."positionId" = positions.id
    `
    let filtersQuery = `
        ${sumFiltersQuery(filters)}
        AND "usersPositions"."deletedAt" IS NULL
        AND positions.type = '${positionTypesConstant.GENERUS}'
    `

    let groupQuery = `
        GROUP BY materials.${structure}
    `

    let orderQuery = `
        ORDER BY materials.${structure}
    `

    if (filters?.usersGrade) {
        baseJoinQuery += `
            INNER JOIN students ON users.id = students."userId"
        `
        filtersQuery += filterByUsersGrade(filters)
    }

    if (filters?.ancestorId) {
        baseJoinQuery += `
            INNER JOIN organizations on positions."organizationId" = organizations.id
            INNER JOIN "organizationHierarchies" on organizations.id = "organizationHierarchies"."descendantId"
        `
        filtersQuery += `
            AND "organizationHierarchies"."ancestorId" = ${Number(filters.ancestorId)}
        `
    }

    const query = selectQuery + baseJoinQuery + filtersQuery + groupQuery + orderQuery
    return db.query(query, {
            type: QueryTypes.SELECT,
        }
    )
}

completionRepository.countUsers = async (positionType, organizationId, usersGrade, ancestorId) => {
    let selectQuery = `
        SELECT COUNT("usersPositions"."userId") as "usersCount"
    `
    let baseJoinQuery = `
        FROM "usersPositions"
        INNER JOIN positions on "usersPositions"."positionId" = positions.id
    `
    let filtersQuery = `
        WHERE "usersPositions"."deletedAt" IS NULL
        AND positions.type = '${positionType}'
    `

    if (organizationId) {
        filtersQuery += `
            AND positions."organizationId" = ${Number(organizationId)}
        `
    }

    if (usersGrade) {
        baseJoinQuery += `
            INNER JOIN students on "usersPositions"."userId" = students."userId"
        `
        filtersQuery += `
            AND students.grade = ${Number(usersGrade)}
        `
    }
    
    if (ancestorId) {
        baseJoinQuery += `
            INNER JOIN organizations on positions."organizationId" = organizations.id
            INNER JOIN "organizationHierarchies" on organizations.id = "organizationHierarchies"."descendantId"
        `
        filtersQuery += `
            AND "organizationHierarchies"."ancestorId" = ${Number(ancestorId)}
        `
    }

    const query = selectQuery + baseJoinQuery + filtersQuery
    const [data] = await db.query(query)
    return data[0]
}

module.exports = completionRepository
