const asyncHandler = require('express-async-handler')
const userService = require('./userService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const organizationLevelsConstant = require('../../../constants/organizationLevelsConstant')

const userController = {}

// @desc    list users
// @route   GET /users?isActive=&search=&page=&pageSize=
// @access  Private
userController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.user.list.event
    const { isActive, ancestorId, organizationId, sex, positionType, grade } = req.query
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const ancestorIdScope = calculateAncestorIdScope(req.auth.data, ancestorId)    
    const filters = { 
        userId: req.auth.data.id,
        ancestorId: ancestorIdScope,
        isActive,
        organizationId,
        sex,
        positionType,
        grade,
    }

    const { data, total } = await userService.getUsers(filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

const calculateAncestorIdScope = (session, ancestorId) => {
    // Access for PPG (organization level = 0) Admin
    if (session.position.orgLevel === organizationLevelsConstant.ppg) return ancestorId

    // Other Admins only can view users in the same level with the Admins
    // The list will return users in scope level 1 (hierarchy=1)
    const isAdmin = session.position.type === positionTypesConstant.ADMIN
    return isAdmin ? session.position.orgId : session.position.hierarchy[1]?.id
}

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

module.exports = userController