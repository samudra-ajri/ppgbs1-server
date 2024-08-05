const loggerStatusConstant = require('../constants/loggerStatusConstant')
const logger = require('../pkg/logger')

const loggerUtils = {}

loggerUtils.logger = ({ req, status, message, statusCode }) => {
    const severity = status === loggerStatusConstant.FAILED ? 'error' : 'info'
    logger[severity]({
        event: req.event,
        status,
        message: message || status.toLowerCase(),
        request: generateReqLog(req),
        session: req.auth,
        statusCode: statusCode || 200
    })
}

generateReqLog = (req) => {
    const { method, originalUrl, headers, params, query, body } = req
    return bodyLog = {
        method,
        originalUrl,
        headers: { 'userAgent': headers['user-agent']},
        params,
        query,
        body: sanitize(body),
        ip: req.headers['x-forwarded-for'] || req.ip,
    }
}

const sanitize = (data) => {
    const fieldsToRemove = ['password', 'password2']
    const sanitized = { ...data }
    fieldsToRemove.forEach(field => {
        delete sanitized[field]
    })
    sanitized.instituteTags = parseTags(sanitized.instituteTags)
    sanitized.figureTags = parseTags(sanitized.figureTags)
    return sanitized
}

const parseTags = (tags) => {
    return tags?.split(' ').filter(tag => tag !== '')
}

module.exports = loggerUtils