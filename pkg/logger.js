const { createLogger, format, transports } = require('winston')
const { Client } = require('@elastic/elasticsearch')
const ElasticsearchTransport = require('winston-elasticsearch').ElasticsearchTransport
const config = require('../config')

// Create an Elasticsearch client
const esClient = new Client({
    node: `https://${config.ELASTICSEARCH_USERNAME}:${config.ELASTICSEARCH_PASSWORD}@${config.ELASTICSEARCH_HOST}`
})

// Configure Elasticsearch transport
const now = new Date()
const month = now.getMonth() + 1
const year = now.getFullYear()
const esTransport = new ElasticsearchTransport({
    level: 'info',
    index: `pigaru-logs.${month}.${year}`,
    client: esClient,
})

// Create a logger instance
const transportPipes = [new transports.Console()]
if (config.LOGGING_ENABLED) transportPipes.push(esTransport)
const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: transportPipes,
})

module.exports = logger