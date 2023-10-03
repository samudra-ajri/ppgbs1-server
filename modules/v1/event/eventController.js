const asyncHandler = require('express-async-handler')
const eventService = require('./eventService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')

const eventController = {}

module.exports = eventController