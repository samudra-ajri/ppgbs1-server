const redis = require('redis')
const config = require('../config')

const Redis = {}

Redis.client = redis.createClient({
  url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  password: config.REDIS_PASSWORD
})

Redis.store = (key, value, ttl) => {
  return Redis.client.set(key, value, {
    EX: ttl || config.REDIS_TTL,
  })
}

Redis.get = (key) => {
  return Redis.client.get(key)
}

module.exports = Redis