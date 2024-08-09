const asyncHandler = require('express-async-handler')
const directoryService = require('./directoryService')
const { paginate } = require('../../../utils/paginationUtils')
const eventConstant = require('../../../constants/eventConstant')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { logger } = require('../../../utils/loggerUtils')
const directoryType = require('../../../constants/directoryType')
const positionTypesConstant = require('../../../constants/positionTypesConstant')

const directoryController = {}

// @desc    list directories
// @route   GET /directories
// @access  Protect
directoryController.list = asyncHandler(async (req, res) => {
    const session = req.auth.data
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20

    const type = session.position.type === positionTypesConstant.ADMIN ? '' : directoryType.PUBLIC
    const filters = { type }

    const { data, total } = await directoryService.getDirectories(filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
})

// @desc    create directory
// @route   POST /directories
// @access  Protect, Admin
directoryController.create = asyncHandler(async (req, res) => {
    req.event = eventConstant.directory.create.event
    const data = { payload: req.body }
    await directoryService.createDirectory(data)
    res.status(201).json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS, message: null, statusCode: 201 })
})

// @desc    delete directory
// @route   DELETE /directories
// @access  Protect, Admin
directoryController.delete = asyncHandler(async (req, res) => {
    req.event = eventConstant.directory.delete.event
    const { id } = req.params
    await directoryService.deleteDirectory(id)
    res.json({ id })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = directoryController