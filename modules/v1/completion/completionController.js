const asyncHandler = require('express-async-handler')
const completionService = require('./completionService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')

const completionController = {}

// @desc    completions list
// @route   GET /completions/
// @access  Protect
completionController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.list.event

    const { grade, subject, category, subcategory, organizationId, userId, materialId } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { grade, subject, category, subcategory, organizationId, userId, materialId }

    const { data, total } = await completionService.getCompletions(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    my completions list
// @route   GET /completions/me
// @access  Protect
completionController.me = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.list.event

    const userId = req.auth.data.id
    const { grade, subject, category, subcategory, materialId } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { grade, subject, category, subcategory, userId, materialId }

    const { data, total } = await completionService.getCompletions(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    create completions
// @route   POST /completions
// @access  Protect
completionController.create = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.create.event
    const session = req.auth.data
    const { materialIds } = req.body
    await completionService.createCompletions(session, materialIds)
    res.status(201).json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS, message: '', statusCode: 201 })
})

// @desc    delete completions
// @route   DELETE /completions?materialIds=
// @access  Protect
completionController.delete = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.delete.event
    const session = req.auth.data
    const { materialIds } = req.query
    const materialIdsArray = materialIds.split(',').map(Number)
    await completionService.deleteCompletions(session, materialIdsArray)
    res.json({ materialIds: materialIdsArray })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = completionController