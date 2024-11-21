const { Client } = require('@elastic/elasticsearch')
const config = require('../config')

let esClient = null

if (config.ELASTICSEARCH_ENABLED) {
  esClient = new Client({
    node: `https://${config.ELASTICSEARCH_USERNAME}:${config.ELASTICSEARCH_PASSWORD}@${config.ELASTICSEARCH_HOST}`,
  })
}

module.exports = esClient
