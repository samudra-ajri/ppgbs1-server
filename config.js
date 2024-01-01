require('dotenv').config();

// Helper functions for common operations
const getEnv = (key, defaultValue = '') => process.env[key] || defaultValue;
const getEnvNumber = (key, defaultValue = 0) => Number(process.env[key] || defaultValue);
const getEnvBoolean = (key, defaultValue = false) => process.env[key] === 'true' ? true : defaultValue;

module.exports = {
    NODE_ENV: getEnv('NODE_ENV', 'development'),
    APP_URL: getEnv('APP_URL', 'http://localhost'),
    APP_NAME: getEnv('APP_NAME'),
    PORT: getEnvNumber('PORT', 5000),
    ORIGIN: getEnv('ORIGIN', '*'),
    APP_VERSION: getEnv('APP_VERSION', 'v1'),

    JWT_KEY: getEnv('JWT_KEY', 'jwtkey'),

    // Database configuration
    DB_DIALECT: getEnv('DB_DIALECT'),
    DB_URL: `${getEnv('DB_DIALECT')}://${getEnv('DB_USER')}:${getEnv('DB_PWD')}@${getEnv('DB_HOST')}:${getEnv('DB_PORT')}/${getEnv('DB_NAME')}`,
    POOL_SIZE: getEnvNumber('POOL_SIZE', 10),
    POOL_IDLE_TIMEOUT: getEnvNumber('POOL_IDLE_TIMEOUT', 60000),

    // Redis configuration
    REDIS_HOST: getEnv('REDIS_HOST', 'localhost'),
    REDIS_PORT: getEnvNumber('REDIS_PORT', 6379),
    REDIS_PASSWORD: getEnv('REDIS_PASSWORD'),
    REDIS_TTL: getEnvNumber('REDIS_TTL', 7200),
  
    // Elasticsearch configuration
    ELASTICSEARCH_HOST: getEnv('ELASTICSEARCH_HOST'),
    ELASTICSEARCH_PORT: getEnv('ELASTICSEARCH_PORT'),
    LOGGING_ENABLED: getEnvBoolean('LOGGING_ENABLED', false)
};
