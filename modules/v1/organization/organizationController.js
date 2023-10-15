const asyncHandler = require('express-async-handler')
const organizationService = require('./organizationService')
const { paginate } = require('../../../utils/paginationUtils')

const organizationController = {}

// @desc    list organizations
// @route   GET /organizations
// @access  Public
organizationController.list = asyncHandler(async (req, res) => {
    const { level, ancestorId } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { level, ancestorId }
    const { data, total } = await organizationService.getOrganizations(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
})

module.exports = organizationController