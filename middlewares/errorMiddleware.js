const { logger } = require('../utils/loggerUtils')
const loggerStatusConstant = require('../constants/loggerStatusConstant')

const errorMiddleware = {}

errorMiddleware.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

errorMiddleware.errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode ? err.statusCode : 500
    
    if (err.message === 'Request failed with status code 400') {
        statusCode = 400
        err.message = 'Token tidak valid'
    }

    const message =  err.message
    res.status(statusCode)
    res.json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })

    logger({ req, status: loggerStatusConstant.FAILED, message, statusCode })
}

module.exports = errorMiddleware