const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
const config = require('../config');

const authUtils = {}

authUtils.getToken = (data) => {
    return JWT.sign(data, config.JWT_KEY, { expiresIn: '24h'})
}

authUtils.generatePassword = (password) => {
    return bcrypt.hash(password, 10)
}

authUtils.verifyPassword = (password, hash) => {
    return bcrypt.compare(password, hash)
}

module.exports = authUtils