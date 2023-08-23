import loggerStatus from '../consts/loggerStatus.js'
import logger from '../pkg/logger.js'

const loggerUtils = {}

loggerUtils.logger = ({ req, status, message, statusCode }) => {
    const severity = status === loggerStatus.FAILED ? 'error' : 'info'
    logger[severity]({
        event: req.event,
        status,
        message: message || status.toLowerCase(),
        request: generateReqLog(req),
        session: req.user,
        statusCode: statusCode || 200
    })
}

const generateReqLog = (req) => {
    const { method, originalUrl, headers, params, query, body } = req
    return {
        method,
        originalUrl,
        headers: { 'userAgent': headers['user-agent']},
        params,
        query,
        body: sanitize(body)
    }
}

const sanitize = (data) => {
    const fieldsToRemove = ['password', 'password2']
    const sanitized = { ...data }
    fieldsToRemove.forEach(field => {
        delete sanitized[field]
    })
    return sanitized
}

export default loggerUtils.logger
