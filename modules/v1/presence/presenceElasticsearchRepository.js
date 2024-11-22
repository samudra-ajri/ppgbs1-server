const esClient = require('../../../pkg/esClient')

const presenceElasticsearchRepository = {}

const now = new Date()
const month = now.getMonth() + 1
const year = now.getFullYear()
const index = `pigaru-olap-presences-${year}.${month}`

presenceElasticsearchRepository.insert = (data) => {
    const transformedData = {
        ...data,
        eventEndDate: new Date(Number(data.eventEndDate)).toISOString(),
        eventStartDate: new Date(Number(data.eventStartDate)).toISOString(),
        presenceCreatedAt: new Date(Number(data.presenceCreatedAt)).toISOString(),
        timestamp: new Date().toISOString(),
    }

    esClient?.index({
        index,
        body: transformedData,
    })
}

presenceElasticsearchRepository.updatePresenceStatus = (data) => {
    const { eventId, userId, status } = data

    const scriptSource = `
      ctx._source['presenceStatus'] = params['presenceStatus'];
      ctx._source['presenceCreatedAt'] = params['presenceCreatedAt'];
    `

    const scriptParams = {
        presenceStatus: status.toUpperCase(),
        presenceCreatedAt: new Date().toISOString(),
    }

    esClient?.updateByQuery({
        index,
        body: {
            script: {
                source: scriptSource,
                params: scriptParams,
                lang: 'painless',
            },
            query: {
                bool: {
                    must: [
                        { term: { 'eventId.keyword': eventId } },
                        { term: { 'userId.keyword': userId } },
                    ],
                },
            },
        },
    })
}

presenceElasticsearchRepository.deletePresence = (eventId, userId) => {
    esClient?.deleteByQuery({
        index,
        body: {
            query: {
                bool: {
                    must: [
                        { term: { 'eventId.keyword': eventId } },
                        { term: { 'userId.keyword': userId } },
                    ],
                },
            },
        },
    })
}

module.exports = presenceElasticsearchRepository
