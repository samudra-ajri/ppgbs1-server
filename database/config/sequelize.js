const config = require('../../config')

module.exports = {
    development: {
        url: config.DB_URL,
        dialect: config.DB_DIALECT,
    },
    production: {
        url: config.DB_URL,
        dialect: config.DB_DIALECT,
    }
}