const { Client } = require('@elastic/elasticsearch')
const config = require('../config')

let esClient = null

if (config.ELASTICSEARCH_ENABLED) {
  const hostUrl = new URL(config.ELASTICSEARCH_HOST)
  hostUrl.username = config.ELASTICSEARCH_USERNAME
  hostUrl.password = config.ELASTICSEARCH_PASSWORD

  esClient = new Client({
    node: hostUrl.toString(),
  })
}

module.exports = esClient