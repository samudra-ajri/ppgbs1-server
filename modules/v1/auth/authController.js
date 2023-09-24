const expressAsyncHandler = require('express-async-handler')
const authService = require('./authService')
const eventConstant = require('../../../constants/eventConstant')
const loggerUtils = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')

const authController = {}

// @desc    login
// @route   POST /auths/login
// @access  Public
authController.login = expressAsyncHandler(async (req, res) => {
    req.event = eventConstant.auth.login.event
    const data = await authService.getUser(req.body)
    res.json({ data })
    loggerUtils.logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = authController