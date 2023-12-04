require('dotenv').config()

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_URL: process.env.APP_URL || 'http://localhost',
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT || 5000,
    ORIGIN: process.env.ORIGIN || '*',
    APP_VERSION: process.env.APP_VERSION || 'v1',

    JWT_KEY: process.env.JWT_KEY || 'jwtkey',

    DB_DIALECT: process.env.DB_DIALECT,
    DB_URL: `${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    POOL_SIZE: Number(process.env.POOL_SIZE) || 10,
    POOL_IDLE_TIMEOUT: Number(process.env.POOL_IDLE_TIMEOUT) || 60000,

    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_TTL: process.env.REDIS_TTL || 7200,
  
    ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST,
    ELASTICSEARCH_PORT: process.env.ELASTICSEARCH_PORT,
}
