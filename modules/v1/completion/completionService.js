const completionRepository = require('./completionRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const positionTypesConstant = require('../../../constants/positionTypesConstant')

const completionService = {}

completionService.getCompletions = async (filters, page, pageSize) => {
    const { data, total } = await completionRepository.findAll(filters, page, pageSize)
    return { data, total }
}

completionService.createCompletions = async (session, materialIds) => {
    const event = eventConstant.completion.create
    const foundMaterials = await completionRepository.findMaterials(materialIds)
    if (!materialIds.length || foundMaterials.length < materialIds.length) {
        throwError(event.message.failed.undefinedMaterial, 404)
    }

    try {
        await completionRepository.insert(session.id, materialIds)
    } catch (error) {
        if (error.original?.constraint === 'uniqueUserIdMaterialId') throwError(event.message.failed.alreadyExists, 403)
        throwError(error.message, 500)
    }
}

completionService.deleteCompletions = async (session, materialIds) => {
    const event = eventConstant.completion.delete
    const userId = session.id
    const foundMaterials = await completionRepository.findUsersCompletions(userId, materialIds)
    if (!materialIds.length || foundMaterials.length < materialIds.length) {
        throwError(event.message.failed.undefinedMaterial, 404)
    }
    await completionRepository.delete(userId, materialIds)
}

completionService.sumCompletion = async (structure, userId, filters) => {
    validateStructure(structure)
    await validateUser(userId)
    const materialsMultiplier = 1
    const completionsCount = await completionRepository.countUserCompletions(structure, userId, filters)
    const materialsCount = await completionRepository.countUserCompletionsMaterials(structure, filters)
    return calculateSumCompletions(completionsCount, materialsCount, structure, materialsMultiplier)
}

completionService.sumCompletions = async (structure, filters) => {
    validateStructure(structure)
    const materialsMultiplier = await getUsersCount(positionTypesConstant.GENERUS, filters)
    const completionsCount = await completionRepository.countUsersCompletions(structure, filters)
    const materialsCount = await completionRepository.countUserCompletionsMaterials(structure, filters)
    return calculateSumCompletions(completionsCount, materialsCount, structure, materialsMultiplier)
}

const validateStructure = (structure) => {
    const event = eventConstant.completion.sum
    const listedStructures = ['grade', 'subject', 'category', 'subcategory', 'material',]
    const isListedStructure = listedStructures.includes(structure)
    if (!isListedStructure) throwError(`${event.message.failed.structureNotFound} (structure=${structure})`, 404)
}

const validateUser = async (userId) => {
    if (!userId) return
    const event = eventConstant.completion.sum
    const foundUserCompletion = await completionRepository.findOneByUserId(userId)
    if (!foundUserCompletion) throwError(event.message.failed.userNotFound, 404)
}

const getUsersCount = async (positionTypes, filters) => {
    const { organizationId, usersGrade } = filters
    const { usersCount } = await completionRepository.countUsers(positionTypes, organizationId, usersGrade)
    return Number(usersCount)
}

const calculateSumCompletions = (completionsCount, materialsCount, structure, materialsMultiplier) => {
    return materialsCount.map(material => {
        const completion = completionsCount.find(c => c[structure] === material[structure])
        const completionCount = completion ? parseInt(completion.count, 10) : 0
        const materialCount = parseInt(material.count, 10)
        const percentage = materialsMultiplier 
            ? (+(completionCount / (materialCount * materialsMultiplier) * 100).toFixed(2))
            : 0

        const sumData = { completionCount, materialCount, materialsMultiplier, percentage }
        sumData[structure] = material[structure]
        return sumData
    })
}

module.exports = completionService
