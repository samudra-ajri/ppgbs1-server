const userPositionRepository = require('./userPositionRepository')
const eventConstant = require('../../../constants/eventConstant')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const { throwError } = require('../../../utils/errorUtils')

const userPositionService = {}

userPositionService.delete = async (userId, positionId, deletedBy) => {
    const deletedUserPosition = await userPositionRepository.findDeletedUserPosition(userId, positionId)
    if (deletedUserPosition) {
        await userPositionRepository.undoDelete(userId, positionId)
    } else {
        await userPositionRepository.delete(userId, positionId, deletedBy)
    }
}

userPositionService.hardDelete = async (userId, positionId, deletedBy) => {
    await userPositionRepository.hardDelete(userId, positionId, deletedBy)
}

userPositionService.change = async (userId, positionId, newPositionId) => {
    const event = eventConstant.userPosition.changeUserPosition
    const userPosition = await userPositionRepository.findUserPosition(userId, positionId)
    if (!userPosition) throwError(event.message.failed.notFound, 404)
    
    const foundPosition = await userPositionRepository.findPosition(newPositionId)
    if (!foundPosition) throwError(event.message.failed.notFoundPosition, 404)
    if (foundPosition.type !== userPosition.type) throwError(event.message.failed.mismatch, 404)
    
    await userPositionRepository.changeUserPosition(userId, positionId, newPositionId)
}

userPositionService.create = async (userId, newPositionId) => {
    const event = eventConstant.userPosition.createUserPosition
    const userPosition = await userPositionRepository.findUserPosition(userId, newPositionId)
    if (userPosition) throwError(event.message.failed.alreadyExists, 403)
    
    const foundPosition = await userPositionRepository.findPosition(newPositionId)
    if (!foundPosition) throwError(event.message.failed.notFoundPosition, 404)

    const data = {
        userId, 
        newPositionId, 
        type: foundPosition.type,
    }
    await userPositionRepository.createUserPosition(data)
}

userPositionService.createByAdmin = async (userId, organizationId, type, requesterPositionType) => {
    const event = eventConstant.userPosition.createUserPositionByAdmin

    if (!positionTypesConstant[type]) throwError(event.message.failed.invalidType, 400)
    const isAdminRequester = requesterPositionType === positionTypesConstant.ADMIN
    if (type === 'ADMIN' && !isAdminRequester) throwError(event.message.failed.forbiddenType, 403)

    const foundUser = await userPositionRepository.findUser(userId)
    if (!foundUser) throwError(event.message.failed.notFound, 404)

    const foundPosition = await userPositionRepository.findPositionByOrganization(organizationId, type)
    if (!foundPosition) throwError(event.message.failed.notFoundPosition, 404)

    const data = {
        userId,
        newPositionId: foundPosition.id,
        type: foundPosition.type,
    }

    const userPosition = await userPositionRepository.findUserPosition(userId, foundPosition.id)
    if (userPosition) throwError(event.message.failed.alreadyExists, 403)

    const deletedUserPosition = await userPositionRepository.findDeletedUserPosition(userId, foundPosition.id)
    if (deletedUserPosition) {
        await userPositionRepository.restoreUserPosition(data)
    } else {
        await userPositionRepository.createUserPosition(data)
    }

    return { userId, positionId: foundPosition.id, type: foundPosition.type }
}

module.exports = userPositionService
