import asyncHandler from 'express-async-handler'
import randomstring from 'randomstring'
import roleTypes from '../consts/roleTypes.js'
import Completion from '../models/completionModel.js'
import User from '../models/userModel.js'
import filterLocation from '../utils/filterLocation.js'
import filterManager from '../utils/filterManager.js'
import generateToken from '../utils/generateToken.js'
import sortQuery from '../utils/sortQuery.js'
import validateDate from '../utils/validateDate.js'
import throwError from '../utils/errorUtils.js'
import eventTypes from '../consts/eventTypes.js'
import loggerUtils from '../utils/logger.js'
import loggerStatus from '../consts/loggerStatus.js'

// @desc    Register new user
// @route   POST /api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
    const event = eventTypes.user.register
    req.event = event.event
    const {
        name,
        yearBirth,
        monthBirth,
        dayBirth,
        sex,
        username,
        email,
        phone,
        password,
        isMuballigh,
        ds,
        klp,
        // Addition for muballigh data
        hometown,
        isMarried,
        pondok,
        kertosonoYear,
        firstDutyYear,
        timesDuties,
        education,
        greatHadiths
    } = req.body
    let { role } = req.body

    let filter = {}
    if (phone) {
        filter = { phone }
    } else if (email) {
        filter = { email }
    } else if (phone && email) {
        filter = { $or: [{ phone }, { email }] }
    } else {
        throwError(event.message.failed.undefinedCredentials, 400)
    }

    const userExists = await User.find(filter)
    if (!role) role = roleTypes.GENERUS

    if (userExists.length > 1) throwError(event.message.failed.registeredCredentials, 400) // User had registered as generus and Teacher
    if (userExists[0]?.role === role) throwError(event.message.failed.registeredCredentials, 400) // Generus and Teacher possible as a one user
    if (!validateDate(yearBirth, monthBirth, dayBirth)) throwError(event.message.failed.invalidDate, 400)

    const user = await User.create({
        name,
        birthdate: new Date(Date.UTC(Number(yearBirth), Number(monthBirth) - 1, Number(dayBirth))),
        sex,
        username,
        email,
        phone,
        password,
        isMuballigh,
        ds,
        klp,
        role,
        hometown,
        isMarried,
        pondok,
        kertosonoYear,
        firstDutyYear,
        timesDuties,
        education,
        greatHadiths
    })

    if (user) {
        const { password, ...userData } = user._doc
        res.status(201).json({
            ...userData,
            token: generateToken(user._id)
        })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(event.message.failed.invalidData, 400)
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const event = eventTypes.user.login
    req.event = event.event
    const { userData, password, role } = req.body

    const loginMatch = [{ $or: [{ phone: userData }, { email: userData }, { username: userData }] }]
    if (role === roleTypes.GENERUS) {
        loginMatch.push({ role }) 
    } else {
        loginMatch.push({ role: { $ne: roleTypes.GENERUS } }) 
    }
    const user = await User.findOne({ $and : loginMatch })
    if (user && (await user.matchPassword(password))) {
        user.lastLogin = Date.now()
        await user.save()
        const { password, ...userData } = user._doc
        loggerUtils({ req, status: loggerStatus.SUCCESS })
        res.status(200).json({
            ...userData,
            token: generateToken(user._id)
        })
    } else {
        throwError(event.message.failed.incorrectPhoneOrPassword, 401)
    }
})

// @desc    Get all users
// @route   GET /api/users?page=&limit=&search=&isresetpassword=
// @access  Private/Manager
const getUsers = asyncHandler(async (req, res) => {
    const event = eventTypes.user.list
    req.event = event.event

    const { sortby, order, search, role, needresetpassword } = req.query;
    const page = req.query.page || 1
    const limit = req.query.limit || 20

    const users = await User.find({ ...filterManager(req.user, search, role, needresetpassword) })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(sortQuery(sortby, order))
        .select('-password')

    res.json({ total: users.length, users })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Manager
const getUserById = asyncHandler(async (req, res) => {
    const event = eventTypes.user.detail
    req.event = event.event

    const user = await User.findById(req.params.id).select('-password')
    res.json(user)
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const event = eventTypes.user.me
    req.event = event.event
    res.status(200).json(req.user)
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Update user data
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
    const event = eventTypes.user.updateProfile
    req.event = event.event
    const user = req.user

    user.name = req.body.name || user.name
    user.sex = req.body.sex || user.sex
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
    user.phone = req.body.phone || user.phone
    user.isMuballigh = req.body.isMuballigh
    user.ds = req.body.ds || user.ds
    user.klp = req.body.klp || user.klp

    const yearBirth = req.body.yearBirth || new Date(user.birthdate).getFullYear()
    const monthBirth = req.body.monthBirth - 1 || new Date(user.birthdate).getMonth()
    const dayBirth = req.body.dayBirth || new Date(user.birthdate).getDate()

    if (req.body.yearBirth || req.body.monthBirth || req.body.dayBirth) {
        if (validateDate(yearBirth, monthBirth, dayBirth)) {
            user.birthdate = new Date(Date.UTC(Number(yearBirth), Number(monthBirth), Number(dayBirth)))
        } else {
            throwError(event.message.failed.invalidBirthdate, 400)
        }
    }

    if (req.body.password) {
        user.password = req.body.password
    }

    const updatedUser = await user.save()
    const { password, ...userData } = updatedUser._doc
    res.json({
        ...userData,
        token: generateToken(user._id)
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Update user data that allowed by Manager
// @route   PUT /api/users/:id
// @access  Private/Manager
const updateUserByManager = asyncHandler(async (req, res) => {
    const event = eventTypes.user.updateByManager
    req.event = event.event

    const user = await User.findById(req.params.id).select('-password')
    user.isMuballigh = req.body.isMuballigh || user.isMuballigh
    user.isActive = req.body.isActive || user.isActive
    user.role = req.body.role || user.role
    user.ds = req.body.ds || user.ds
    user.klp = req.body.klp || user.klp

    // Update user completion
    if (req.body.ds || req.body.klp) {
        await Completion.updateMany({ 
            user: req.params.id 
        }, { 
            $set: { 
                ds: user.ds,
                klp: user.klp,
            } 
        })
    }

    const updatedUser = await user.save()
    const { password, ...userData } = updatedUser._doc
    res.json({
        ...userData,
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Forgot password
// @route   PUT /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const event = eventTypes.user.forgotPassword
    req.event = event.event
    const { userData } = req.body
    const loginMatch = [{ $or: [{ phone: userData }, { email: userData }, { username: userData }] }]
    const user = await User.findOne({ $and : loginMatch })
    if (!user) throwError(event.message.failed.notFoundEmailOrPassowrd, 404)
    user.resetPasswordToken = `${user._id}${randomstring.generate({ length: 10, charset: 'alphabetic'})}`
    user.save()
    res.json({ message: 'success' })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Private/Manager
const resetPassword = asyncHandler(async (req, res) => {
    const event = eventTypes.user.resetPassword
    req.event = event.event
    const user = await User.findOne({ resetPasswordToken: req.params.token })
    if (!user) throwError(event.message.failed.invalidToken, 404)
    user.resetPasswordToken = null
    user.password = req.body.newPassword
    user.save()
    res.json({ message: 'success' })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Manager
const deleteUser = asyncHandler(async (req, res) => {
    const event = eventTypes.user.deleteUser
    req.event = event.event
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ id: req.params.id })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(event.message.failed.notFound, 404)
    }
})

// @desc    Get users roles count
// @route   GET /api/users/roles?ds=&klp=
// @access  Private, Managers
const getRolesCount = asyncHandler(async (req, res) => {
    const { ds, klp } = req.query;
    const locations = []
    if (ds) locations.push({ ds: ds.toUpperCase() })
    if (klp) locations.push({ klp: klp.toUpperCase() })

    const roles = await User.aggregate(
        [
            { $match: filterLocation(locations) },
            {
                $group: {
                    _id: "$role",
                    total: { $sum: 1 }
                }
            },
        ]
    )
    res.status(200).json({
        countRoles: roles,
    })
})

export {
    registerUser,
    loginUser,
    getMe,
    updateMe,
    updateUserByManager,
    getUsers,
    deleteUser,
    getUserById,
    getRolesCount,
    forgotPassword,
    resetPassword
}