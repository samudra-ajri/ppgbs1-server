const asyncHandler = require('express-async-handler')
const userService = require('./userService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')
const { calculateAncestorIdScope } = require('../../../utils/userUtils')
const positionTypesConstant = require('../../../constants/positionTypesConstant')

const userController = {}

// @desc    list users
// @route   GET /users?isActive=&search=&page=&pageSize=
// @access  Private
userController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.list.event
    const { isActive, ancestorId, organizationId, sex, positionType, grade, hasExistPosition } = req.query
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const ancestorIdScope = calculateAncestorIdScope(req.auth.data, ancestorId)   
    const filters = { 
        userId: req.auth.data.id,
        positionId: req.auth.data.position.positionId,
        ancestorId: ancestorIdScope,
        isActive,
        organizationId,
        sex,
        positionType,
        grade,
        hasExistPosition,
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
        positionId: req.auth.data.position.positionId,
        forgotPassword: 'true',
        ancestorId: req.auth.data.position.orgId,
    }

    const { data, total } = await userService.getUsers(filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    user profile
// @route   GET /users/:id
// @access  Protect
userController.detail = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.detail.event
    const data = await userService.getUser(req.params.id)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    update my profile
// @route   PUT /users/me
// @access  Protect
userController.updateMyProfile = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.updateProfile.event
    const data = {
        userData: await userService.getUser(req.auth.data.id),
        payload: req.body
    }
    await userService.updateMyProfile(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    update my student data
// @route   PUT /users/me/student
// @access  Protect
userController.updateMyStudentProfile = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.updateProfileStudent.event
    const data = {
        userData: await userService.getUser(req.auth.data.id),
        payload: req.body
    }
    await userService.updateMyStudentProfile(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    update my teacher data
// @route   PUT /users/me/teacher
// @access  Protect
userController.updateMyTeacherProfile = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.updateProfileTeacher.event
    const data = {
        userData: await userService.getUser(req.auth.data.id),
        payload: req.body
    }
    await userService.updateMyTeacherProfile(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    users list download as excel
// @route   GET /users/download
// @access  Private
userController.download = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.download.event
    const { ancestorId, organizationId, sex, positionType, grade, isActive, hasExistPosition } = req.query

    const ancestorIdScope = calculateAncestorIdScope(req.auth.data, ancestorId)   
    const filters = { 
        userId: req.auth.data.id,
        positionId: req.auth.data.position.positionId,
        ancestorId: ancestorIdScope,
        isActive,
        organizationId,
        sex,
        positionType: positionType ?? positionTypesConstant.GENERUS,
        grade,
        hasExistPosition,
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${Date.now()}.xlsx"`)
    await userService.exportDataAsExcel(res, req.auth.data, filters)

    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    update user student data by admin
// @route   PUT /users/:id/student-by-admin
// @access  Protect, Teacher
userController.updateStudentByAdmin = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.updateProfileStudentByAdmin.event
    const data = {
        userData: await userService.getUser(req.params.id),
        payload: req.body,
        updatedBy: req.auth.data.id
    }
    await userService.updateStudentByAdmin(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = userController