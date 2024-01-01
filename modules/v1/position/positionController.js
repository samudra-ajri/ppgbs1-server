const asyncHandler = require('express-async-handler')
const positionService = require('./positionService')
const { paginate } = require('../../../utils/paginationUtils')

const positionController = {}

// @desc    list positions
// @route   GET /positions
// @access  Public
positionController.list = asyncHandler(async (req, res) => {
    const { positionTypes, organizationId } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { organizationId, positionTypes }
    const { data, total } = await positionService.getPositions(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
})

module.exports = positionController