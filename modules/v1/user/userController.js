const asyncHandler = require('express-async-handler')
const userService = require('./userService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')

const userController = {}

// @desc    list users
// @route   GET /users?isActive=&search=&page=&pageSize=
// @access  Private, Admin
userController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.list.event
    const { isActive, organizationId, forgotPassword, ancestorId, sex, positionType } = req.query
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { 
        userId: req.auth.data.id,
        isActive,
        organizationId,
        forgotPassword,
        ancestorId,
        sex,
        positionType
    }

    const { data, total } = await userService.getUsers(filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ data, ...metadata })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = userController