import asyncHandler from 'express-async-handler'
import eventTypes from '../consts/eventTypes.js'
import loggerUtils from '../utils/logger.js'
import loggerStatus from '../consts/loggerStatus.js'

// @desc    Home
// @route   GET /
// @access  Public
const home = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.home.detail
    req.event = eventLogger.event
    res.json({
        app: process.env.APP_NAME,
        server: process.env.APP_ENV
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

export { home }
