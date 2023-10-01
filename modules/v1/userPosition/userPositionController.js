const asyncHandler = require('express-async-handler')
const userPositionService = require('./userPositionService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')

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

// @desc    change user position
// @route   PUT /users/positions
// @access  Private
userPositionController.change = asyncHandler(async (req, res) => {
    req.event = eventConstant.userPosition.changeUserPosition.event
    const userId = req.auth.data.id
    const { positionId, newPositionId } = req.body
    await userPositionService.change(userId, positionId, newPositionId)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    create user position
// @route   POST /users/positions
// @access  Private
userPositionController.create = asyncHandler(async (req, res) => {
    req.event = eventConstant.userPosition.createUserPosition.event
    const userId = req.auth.data.id
    const { newPositionId } = req.body
    await userPositionService.create(userId, newPositionId)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = userPositionController