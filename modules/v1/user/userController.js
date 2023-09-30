const asyncHandler = require('express-async-handler')
const userService = require('./userService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')

const userController = {}

// @desc    list users
// @route   GET /users?isActive=&search=&page=&pageSize=
// @access  Private
userController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.list.event
    const { isActive, organizationId, ancestorId, sex, positionType, grade } = req.query
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { 
        userId: req.auth.data.id,
        isActive,
        organizationId,
        ancestorId,
        sex,
        positionType,
        grade,
    }

    const { data, total } = await userService.getUsers(filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    list forgot password users
// @route   GET /users/forgot-password
// @access  Private, Admin
userController.forgotPasswordList = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.forgotPasswordlist.event
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { 
        userId: req.auth.data.id,
        forgotPassword: 'true',
        ancestorId: req.auth.data.position.orgId,
    }

    const { data, total } = await userService.getUsers(filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = userController