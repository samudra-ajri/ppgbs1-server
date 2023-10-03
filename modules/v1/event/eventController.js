const asyncHandler = require('express-async-handler')
const eventService = require('./eventService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')

const eventController = {}

// @desc    create event
// @route   POST /events
// @access  Protect, Admin
eventController.create = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.create.event
    const data = {
        session: req.auth.data,
        payload: req.body,
    }
    await eventService.createEvent(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = eventController