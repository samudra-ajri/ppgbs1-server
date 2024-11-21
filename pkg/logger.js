const { createLogger, format, transports } = require('winston')
const ElasticsearchTransport = require('winston-elasticsearch').ElasticsearchTransport
const config = require('../config')
const esClient = require('./esClient')

// Configure Elasticsearch transport
const transportPipes = [new transports.Console()]

if (config.LOGGING_ENABLED && esClient) {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    const esTransport = new ElasticsearchTransport({
        level: 'info',
        indexPrefix: `pigaru-logs.${month}.${year}`,
        client: esClient,
    })
    transportPipes.push(esTransport)
}

// Create a logger instance
const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: transportPipes,
})

module.exports = logger
