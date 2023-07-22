import { createLogger, format, transports } from 'winston'
import { Client } from '@elastic/elasticsearch'
import { ElasticsearchTransport } from 'winston-elasticsearch'
import dotenv from 'dotenv'

dotenv.config()

// Create an Elasticsearch client
const esClient = new Client({ 
    node: `http://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`
})

// Configure Elasticsearch transport
const esTransport = new ElasticsearchTransport({
    level: 'info',
    index: 'pigaru-logs',
    client: esClient,
})

// Create a logger instance
const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        esTransport,
        new transports.Console()
    ],
})

export default logger