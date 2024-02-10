const asyncHandler = require('express-async-handler')
const authService = require('./authService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')

const authController = {}

// @desc    register
// @route   POST /auths/register
// @access  Public
authController.register = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.register.event
    await authService.createUser(req.body)
    res.status(201).json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS, message: null, statusCode: 201 })
})

// @desc    login
// @route   POST /auths/login
// @access  Public
authController.login = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.login.event
    const data = await authService.getUser(req.body)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    my profile
// @route   GET /auths/me
// @access  Protect
authController.me = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.me.event
    const payload = {
        userId: req.auth.data.id,
        positionId: req.auth.data.position.positionId
    }
    const data = await authService.getUserProfile(payload)
    data.exp = req.auth.data.exp
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    switch position
// @route   POST /auths/switch-position
// @access  Protect
authController.switchPosition = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.switchPosition.event
    const payload = {
        login: req.auth.data.login,
        positionId: req.body.positionId
    }
    const data = await authService.switchUserPosition(payload)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    forgot password
// @route   PUT /auths/forgot-password
// @access  Public
authController.forgotPassword = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.forgotPassword.event
    await authService.forgotPassword(req.body)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    temporary user password
// @route   PUT /auths/temp-password/:token
// @access  Protect, Admin
authController.tempPassword = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.tempPassword.event
    const data = {
        token: req.params.token,
        tempPassword: req.body.tempPassword,
        updatedBy: req.auth.data.id
    }
    await authService.tempPasswordUser(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    reset user password
// @route   PUT /auths/reset-password/:token
// @access  Protect
authController.resetPassword = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.resetPassword.event
    const { tempPassword, newPassword, confirmNewPassword } = req.body
    const data = {
        token: req.params.token,
        tempPassword,
        newPassword,
        confirmNewPassword,
    }
    await authService.resetPassword(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    update my password
// @route   PUT /auths/update-password
// @access  Protect
authController.updatePassword = asyncHandler(async (req, res) => {
    req.event = eventConstant.auth.updatePassword.event
    const { currentPassword, newPassword, confirmNewPassword } = req.body
    const data = {
        userId: req.auth.data.id,
        currentPassword,
        newPassword,
        confirmNewPassword
    }
    await authService.updatePassword(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    hashing string
// @route   POST /auths/hash-string
// @access  Public
authController.hashString = asyncHandler(async (req, res) => {
    const { string } = req.body
    const hashedString = await authService.hashString(string)
    res.json({ data: { hashedString } })
})

module.exports = authController