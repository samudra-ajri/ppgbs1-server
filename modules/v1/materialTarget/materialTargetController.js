const asyncHandler = require('express-async-handler')
const materialTargetService = require('./materialTargetService')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const eventConstant = require('../../../constants/eventConstant')
const { paginate } = require('../../../utils/paginationUtils')

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

// @desc    list material targets
// @route   GET /material-targets
// @access  Protect
materialTargetController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.materialTarget.list.event

    const { month, year, materialId, grade } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 1000
    const filters = { month, year, materialId, grade }

    const { data, total } = await materialTargetService.getMaterialTargets(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })

    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    list material target ids
// @route   GET /material-targets/ids
// @access  Protect
materialTargetController.listIds = asyncHandler(async (req, res) => {
    req.event = eventConstant.materialTarget.listIds.event

    const { month, year, materialId, grade } = req.query
    const filters = { month, year, materialId, grade }

    const data = await materialTargetService.getMaterialTargetIds(filters)

    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    update material target
// @route   PUT /material-targets/:id
// @access  Protect
materialTargetController.update = asyncHandler(async (req, res) => {
    req.event = eventConstant.materialTarget.update.event
    const { id } = req.params
    const { grades, month, year } = req.body

    await materialTargetService.updateMaterialTarget(id, { grades, month, year })

    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    delete material target
// @route   DELETE /material-targets/:id
// @access  Protect
materialTargetController.delete = asyncHandler(async (req, res) => {
    req.event = eventConstant.materialTarget.delete.event
    const { id } = req.params

    await materialTargetService.deleteMaterialTarget(id)

    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = materialTargetController
