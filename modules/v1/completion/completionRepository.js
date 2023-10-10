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

const filterByDefault = () => {
    return `
        WHERE 1 = 1
    `
}

const filterByPosition = (filters) => {
    const { position } = filters
    if (position) {
        return `
            AND positions.type = '${positionTypesConstant.GENERUS}'
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
            AND organizations.id = ${Number(organizationId)}
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

completionRepository.countCompletions = async (structure, userId) => {
    return db.query(`
        SELECT ${structure}, COUNT(materials.id) as count
        FROM "usersCompletions"
        INNER JOIN materials ON "usersCompletions"."materialId" = materials.id
        WHERE "usersCompletions"."userId" = $1
        GROUP BY ${structure}
        ORDER BY ${structure}`, {
            bind: [userId],
            type: QueryTypes.SELECT,
        }
    )
}

completionRepository.countMaterials = async (structure, filters) => {
    delete filters.userId
    delete filters.organizationId
    delete filters.position
    return db.query(`
        SELECT ${structure}, COUNT(id) as count
        FROM materials
        GROUP BY ${structure}
        ORDER BY ${structure}`, {
            type: QueryTypes.SELECT,
        }
    )
}

completionRepository.countUsers = async (positionType) => {
    const [data] = await db.query(`
        SELECT COUNT("userId") as "usersCount"
        FROM "usersPositions"
        INNER JOIN positions on "usersPositions"."positionId" = positions.id
        WHERE positions.type = $1`, {
            bind: [positionType],
            type: QueryTypes.SELECT,
        }
    )
    return data
}

module.exports = completionRepository
