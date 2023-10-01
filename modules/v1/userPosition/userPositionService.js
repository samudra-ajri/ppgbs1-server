const userPositionRepository = require('./userPositionRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')

const userPositionService = {}

userPositionService.delete = async (userId, positionId, deletedBy) => {
    const event = eventConstant.userPosition.deleteUserPosition
    const userPosition = await userPositionRepository.findUserPosition(userId, positionId)
    if (!userPosition) throwError(event.message.failed.notFound, 404)

    const { type } = userPosition
    await userPositionRepository.delete(userId, positionId, deletedBy, type)
}

userPositionService.change = async (userId, positionId, newPositionId) => {
    const event = eventConstant.userPosition.changeUserPosition
    const userPosition = await userPositionRepository.findUserPosition(userId, positionId)
    if (!userPosition) throwError(event.message.failed.notFound, 404)
    
    const fondPosition = await userPositionRepository.findPosition(newPositionId)
    if (!fondPosition) throwError(event.message.failed.notFoundPosition, 404)
    if (fondPosition.type !== userPosition.type) throwError(event.message.failed.mismatch, 404)
    
    await userPositionRepository.changeUserPosition(userId, positionId, newPositionId)
}

module.exports = userPositionService
