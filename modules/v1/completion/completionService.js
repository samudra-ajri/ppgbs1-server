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

module.exports = completionService
