const asyncHandler = require('express-async-handler')
const materialService = require('./materialService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')

const materialController = {}

// @desc    material list
// @route   GET /materials/
// @access  Protect
materialController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.material.list.event

    const { grade, subject, category, subcategory } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { grade, subject, category, subcategory }

    const { data, total } = await materialService.getMaterials(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    detail material
// @route   GET /materials/:id
// @access  Protect
materialController.detail = asyncHandler(async (req, res) => {
    req.event = eventConstant.material.detail.event
    const { id } = req.params
    const data = await materialService.getMaterial(id)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    material structure
// @route   GET /materials/structure
// @access  Protect
materialController.structure = asyncHandler(async (req, res) => {
    const data = await materialService.getMaterialStructure()
    res.json({ data })
})

module.exports = materialController