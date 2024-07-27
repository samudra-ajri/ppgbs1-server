const asyncHandler = require('express-async-handler')
const completionService = require('./completionService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const { calculateAncestorIdScope } = require('../../../utils/userUtils')

const completionController = {}

// @desc    completions list
// @route   GET /completions/
// @access  Protect
completionController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.list.event

    const { grade, subject, category, subcategory, organizationId, userId, materialId } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { grade, subject, category, subcategory, organizationId, userId, materialId, position: positionTypesConstant.GENERUS }

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
    const filters = { grade, subject, category, subcategory, userId, materialId, position: positionTypesConstant.GENERUS }

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

// @desc    create completions by admin
// @route   POST /completions/users/:userId/create-by-admin
// @access  Protect, Admin
completionController.createByAdmin = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.create.event
    const { userId } = req.params
    const user = await completionService.getUser(userId)
    const { materialIds } = req.body
    await completionService.createCompletions(user, materialIds)
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

// @desc    delete completions by admin
// @route   DELETE /completions/users/:userId/delete-by-admin?materialIds=
// @access  Protect
completionController.deleteByAdmin = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.delete.event
    const { userId } = req.params
    const { materialIds } = req.query
    const user = await completionService.getUser(userId)
    const materialIdsArray = materialIds.split(',').map(Number)
    await completionService.deleteCompletions(user, materialIdsArray)
    res.json({ materialIds: materialIdsArray })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    sum materials based on the structures for specific user
// @route   GET /completions/:structure/users/:userId
// @access  Protect
completionController.sumUser = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.sum.event
    const { structure, userId } = req.params
    const { grade, subject, category, subcategory } = req.query
    const filters = { grade, subject, category, subcategory }
    const data = await completionService.sumCompletion(structure, userId, filters)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    sum materials based on the structures for all users
// @route   GET /completions/:structure/users
// @access  Protect
completionController.sumUsers = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.sum.event
    const { structure } = req.params
    const { grade, subject, category, subcategory, usersGrade, organizationId, ancestorId } = req.query
    const ancestorIdScope = calculateAncestorIdScope(req.auth.data, ancestorId)
    const filters = {
        grade,
        subject,
        category,
        subcategory,
        usersGrade,
        organizationId,
        ancestorId: ancestorIdScope
    }
    const data = await completionService.sumCompletions(structure, filters)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    completion download as excel
// @route   GET /completions/users/:userId/download
// @access  Protect, Admin
completionController.download = asyncHandler(async (req, res) => {
    req.event = eventConstant.completion.download.event
    const { userId } = req.params
    const user = await completionService.getUser(userId)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="Capaian Materi ${user.name}.xlsx"`)

    const filters = { userId }
    await completionService.exportDataAsExcel(res, filters)

    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = completionController