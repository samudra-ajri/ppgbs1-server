const completionRepository = require('./completionRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')

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

completionService.sumCompletions = async (structure, userId, filters) => {
    const event = eventConstant.completion.sum
    
    const listedStructures = ['grade', 'subject', 'category', 'subcategory', 'material',]
    const isListedStructure = listedStructures.includes(structure)
    if (!isListedStructure) throwError(`${event.message.failed.structureNotFound} (structure=${structure})`, 404)
    
    const foundUserCompletion = await completionRepository.findOneByUserId(userId)
    console.log(foundUserCompletion)
    if (!foundUserCompletion) throwError(event.message.failed.userNotFound, 404)

    filters.userId = userId // it is needed for filter pupose
    const completionsCount = await completionRepository.countCompletions(structure, userId, filters)
    delete filters.userId // removed since the meterials not depend on the user
    const materialsCount = await completionRepository.countMaterials(structure, filters)

    const data = materialsCount.map(material => {
        const completion = completionsCount.find(c => c[structure] === material[structure])
        const completionCount = completion ? parseInt(completion.count, 10) : 0
        const materialCount = parseInt(material.count, 10)
        const precentage = completionCount ? parseFloat((completionCount/materialCount*100).toFixed(2)) : 0
        const sumData = {
            completionCount,
            materialCount,
            precentage,
        }
        sumData[structure] = material[structure]
        return sumData
    })

    return data
}


module.exports = completionService
