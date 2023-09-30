const asyncHandler = require('express-async-handler')
const userPositionService = require('./userPositionService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')

const userPositionController = {}

// @desc    delete user position
// @route   DELETE /users/:userId/positions/:positionId
// @access  Private, Admin
userPositionController.delete = asyncHandler(async (req, res) => {
    req.event = eventConstant.userPosition.deleteUserPosition.event
    const { userId, positionId } = req.params
    const deletedBy = req.auth.data.id
    await userPositionService.delete(userId, positionId, deletedBy)
    res.json({ userId, positionId })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = userPositionController