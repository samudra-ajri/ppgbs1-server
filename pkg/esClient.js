const { Client } = require('@elastic/elasticsearch')
const config = require('../config')

const esClient = new Client({
  node: `https://${config.ELASTICSEARCH_USERNAME}:${config.ELASTICSEARCH_PASSWORD}@${config.ELASTICSEARCH_HOST}`,
})

module.exports = esClient
