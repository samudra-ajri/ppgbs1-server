const asyncHandler = require('express-async-handler')
const userPositionService = require('./userPositionService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')

const userPositionController = {}

module.exports = userPositionController