const stringUtils = {}

stringUtils.makeRedisKeyFromObject = (obj) => {
    return Object.keys(obj).map(key => `${key}.${obj[key]}`).join('.');
}

stringUtils.isValidDate = (dateString) => {
    // Regular expression to match the "YYYY-MM-DD" format
    const regex = /^\d{4}-\d{2}-\d{2}$/
    return regex.test(dateString)
}

module.exports = stringUtils