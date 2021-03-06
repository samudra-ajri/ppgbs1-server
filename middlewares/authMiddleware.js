import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import roleTypes from '../consts/roleTypes.js'

const protect = asyncHandler (async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

const manager = (req, res, next) => {
    if (req.user.role != roleTypes.GENERUS) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized')
    }
}

const admin = (req, res, next) => {
    if (req.user.role == roleTypes.ADMIN) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized')
    }
}

export { protect, manager, admin }