import asyncHandler from 'express-async-handler'
import roleTypes from '../consts/roleTypes.js'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import sortQuery from '../utils/sortQuery.js'
import validateDate from '../utils/validateDate.js'

// @desc    Register new user
// @route   POST /api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
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
    } = req.body

    const userExists = await User.findOne({ $or:[{ phone }, { email }, { username }] })
    if (userExists) {
        res.status(404)
        throw new Error('Phone, email, or username already exists')
    }

    if (!validateDate(yearBirth, monthBirth, dayBirth)) {
        res.status(400)
        throw new Error('Invalid  user data')
    }

    const user = await User.create({
        name,
        birthdate: new Date(Date.UTC(Number(yearBirth), Number(monthBirth)-1, Number(dayBirth))),
        sex,
        username,
        email,
        phone,
        password,
        isMuballigh,
        ds,
        klp,
        role,
    })

    if (user) {
        const { password, ...userData } = user._doc
        res.status(201).json({
            ...userData,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { userData, password } = req.body
    const user = await User.findOne({ 
        $or:[{ phone: userData }, { email: userData }, { username: userData }] 
    })
    if (user && (await user.matchPassword(password))) {
        const { password, ...userData } = user._doc
        res.status(200).json({
            ...userData,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Manager
const getUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortby, order } = req.query;
    const users = await User.find({ ...filterManager(req.user) })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(sortQuery(sortby, order))
        .select('-password')
        
    res.json({ total: users.length, users })
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// @desc    Update user data
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
    const user = req.user
    
    user.name        = req.body.name || user.name
    user.sex         = req.body.sex || user.sex
    user.username    = req.body.username || user.username
    user.email       = req.body.email || user.email
    user.phone       = req.body.phone || user.phone
    user.isMuballigh = req.body.isMuballigh
    user.Ds          = req.body.Ds || user.Ds
    user.klp         = req.body.klp || user.klp

    const yearBirth  = req.body.yearBirth || new Date(user.birthdate).getFullYear()
    const monthBirth = req.body.monthBirth-1 || new Date(user.birthdate).getMonth()
    const dayBirth   = req.body.dayBirth || new Date(user.birthdate).getDate()

    if (req.body.yearBirth || req.body.monthBirth || req.body.dayBirth) {
        if (dateValidation(yearBirth, monthBirth, dayBirth)) {
            user.birthdate = new Date(Date.UTC(Number(yearBirth), Number(monthBirth), Number(dayBirth)))
        } else {
            res.status(400)
            throw new Error('Invalid birthdate')
        }
    } 

    if (req.body.password) {
        user.password = req.body.password
    }

    const updatedUser = await user.save()
    const { password, ...userData } = updatedUser._doc
    res.json({
        ...userData,
    })
})

// @desc    Update user data that allowed by Manager
// @route   PUT /api/users/:id
// @access  Private/Manager
const updateUserByManager = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')    
    user.isMuballigh = req.body.isMuballigh || user.isMuballigh
    user.isActive = req.body.isActive || user.isActive
    user.role = req.body.role || user.role
    const updatedUser = await user.save()
    const { password, ...userData } = updatedUser._doc
    res.json({
        ...userData,
    })
})

// @desc    Filter by manager scope
const filterManager = (user) => {
    switch (user.role) {
        case roleTypes.PPG:
            return {}
        case roleTypes.PPD:
            return {ds: user.ds}
        case roleTypes.PPK:
            return {klp: user.klp}
        default:
            return {}
    }
}

export { 
    registerUser,
    loginUser,
    getMe,
    updateMe,
    updateUserByManager,
    getUsers
}