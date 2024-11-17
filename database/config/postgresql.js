const Sequelize = require('sequelize')
const config = require('../../config')

module.exports = new Sequelize(config.DB_URL, {
    logging: false,
    pool: {
        max: config.POOL_SIZE,
        min: 0,
        acquire: 30000,
        idle: config.POOL_IDLE_TIMEOUT
    },
})