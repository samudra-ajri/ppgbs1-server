const asyncHandler = require('express-async-handler')
const materialTargetService = require('./materialTargetService')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const eventConstant = require('../../../constants/eventConstant')

const materialTargetController = {}

// @desc    create material target
// @route   POST /material-targets
// @access  Protect
materialTargetController.create = asyncHandler(async (req, res) => {
    req.event = eventConstant.materialTarget.create.event

    const { materialIds, grades, month, year } = req.body

    await materialTargetService.create({ materialIds, grades, month, year })

    res.status(201).json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = materialTargetController
