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

    const { grade, subject, category, subcategory, organizationId } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { grade, subject, category, subcategory, organizationId }

    const { data, total } = await completionService.getCompletions(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = completionController