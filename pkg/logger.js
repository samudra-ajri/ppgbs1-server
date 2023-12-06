const { createLogger, format, transports } = require('winston')
const { Client } = require('@elastic/elasticsearch')
const ElasticsearchTransport = require('winston-elasticsearch').ElasticsearchTransport
const config = require('../config')

// Create an Elasticsearch client
const esClient = new Client({
    node: `http://${config.ELASTICSEARCH_HOST}:${config.ELASTICSEARCH_PORT}`
})

// Configure Elasticsearch transport
const esTransport = new ElasticsearchTransport({
    level: 'info',
    index: 'pigaru-logs',
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