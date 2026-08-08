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

// @desc    hard delete user position
// @route   DELETE /users/:userId/positions/:positionId/hard-delete
// @access  Private, Admin
userPositionController.hardDelete = asyncHandler(async (req, res) => {
    req.event = eventConstant.userPosition.hardDeleteUserPosition.event
    const { userId, positionId } = req.params
    const deletedBy = req.auth.data.id
    await userPositionService.hardDelete(userId, positionId, deletedBy)
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
    res.status(201).json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS, message: null, statusCode: 201 })
})

// @desc    create user position for another user
// @route   POST /users/:userId/positions
// @access  Private, Admin
userPositionController.createByAdmin = asyncHandler(async (req, res) => {
    req.event = eventConstant.userPosition.createUserPositionByAdmin.event
    const { userId } = req.params
    const { organizationId, type } = req.body
    const requesterPositionType = req.auth.data.position?.type
    const data = await userPositionService.createByAdmin(userId, organizationId, type, requesterPositionType)
    res.status(201).json(data)
    logger({ req, status: loggerStatusConstant.SUCCESS, message: null, statusCode: 201 })
})

// @desc    delete user position for another user
// @route   DELETE /users/:userId/positions?organizationId=&type=
// @access  Private, Admin
userPositionController.deleteByAdmin = asyncHandler(async (req, res) => {
    req.event = eventConstant.userPosition.deleteUserPositionByAdmin.event
    const { userId } = req.params
    const { organizationId, type } = req.query
    const requesterPositionType = req.auth.data.position?.type
    const data = await userPositionService.deleteByAdmin(userId, organizationId, type, requesterPositionType)
    res.json(data)
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = userPositionController