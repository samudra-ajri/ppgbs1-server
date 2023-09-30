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

module.exports = userPositionService
