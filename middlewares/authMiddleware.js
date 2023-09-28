const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const config = require('../config.js')
const positionTypesConstant = require('../constants/positionTypesConstant.js')
const authRepository = require(`../modules/${config.APP_VERSION}/auth/authRepository`)

const authMiddleware = {}

authMiddleware.protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, config.JWT_KEY)
            const user = await authRepository.findUser(decoded.login)
            if (user) {
                req.auth = {
                    isAuthenticated: true,
                    data: decoded
                }
                next()
            }
        } catch (error) {
            res.status(401)
            throw new Error('Missing authentication.')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Missing authentication.')
    }
})

authMiddleware.admin = asyncHandler(async (req, res, next) => {
    if (req.auth.data.position.type !== positionTypesConstant.ADMIN) {
        res.status(401)
        throw new Error('Unauthenticated.')
    }
    next()
})

module.exports = authMiddleware