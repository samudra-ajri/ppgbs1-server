const stringUtils = {}

stringUtils.makeRedisKeyFromObject = (obj) => {
    return Object.keys(obj).map(key => `${key}.${obj[key]}`).join('.');
}

module.exports = stringUtils