const stringUtils = {}

stringUtils.generateKeyFromObject = (obj) => {
    return Object.keys(obj).map(key => `${key}.${obj[key]}`).join('.');
}

stringUtils.makeRedisKey = (modulname, params, sessionId) => {
    const keyService = 'pigaru'
    const keyParams = params ? stringUtils.generateKeyFromObject(params) : ''
    const keys = [keyService, modulname]
    if (params) keys.push(keyParams)
    if (sessionId) keys.push(sessionId)
    return keys.join('.')
}

stringUtils.isValidDate = (dateString) => {
    // Regular expression to match the "YYYY-MM-DD" format
    const regex = /^\d{4}-\d{2}-\d{2}$/
    return regex.test(dateString)
}

stringUtils.generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

module.exports = stringUtils