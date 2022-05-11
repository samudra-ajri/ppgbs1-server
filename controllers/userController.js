import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
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
    })

    if (user) {
        res.status(201).json({
            ...profileResponse(user),
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
    const { username, email, phone, password } = req.body
    const user = await User.findOne({ $or:[{ phone }, { email }, { username }] })
    if (user && (await user.matchPassword(password))) {
        res.json({
            ...profileResponse(user),
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
  })

const profileResponse = user => {
    return {
        _id         : user._id,
        name        : user.name,
        birthdate   : user.birthdate,
        sex         : user.sex,
        phone       : user.phone,
        username    : user.username,
        email       : user.email,
        phone       : user.phone,
        klp         : user.klp,
        isMuballigh : user.isMuballigh,
        ds          : user.ds,
        klp         : user.klp,
        role        : user.role,
        createdAt   : user.createdAt,
        updatedAt   : user.updatedAt
    }
}

export { 
    registerUser,
    loginUser,
}