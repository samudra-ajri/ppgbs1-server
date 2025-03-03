const esClient = require('../../../pkg/esClient')

const presenceElasticsearchRepository = {}

const now = new Date()
const year = now.getFullYear()
const index = `pigaru-olap-presences-${year}`

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

    if (data.eventGroupId) {
        const scriptSourceTotalPresence = `
            ctx._source['totalPresenceGroupEvent'] = params['totalPresenceGroupEvent'];
        `

        const scriptParamsTotalPresence = {
            totalPresenceGroupEvent: data.totalPresenceGroupEvent,
        }

        esClient?.updateByQuery({
            index,
            body: {
                script: {
                    source: scriptSourceTotalPresence,
                    params: scriptParamsTotalPresence,
                    lang: 'painless',
                },
                query: {
                    bool: {
                        must: [
                            { term: { 'eventGroupId.keyword': data.groupId } },
                            { term: { 'userId.keyword': data.userId } },
                        ],
                    },
                },
            },
        })
    }
}

presenceElasticsearchRepository.updatePresenceStatus = (data) => {
    const { eventId, userId, eventGroupId, status, totalPresenceGroupEvent } = data

    const scriptSource = `
      ctx._source['presenceStatus'] = params['presenceStatus'];
      ctx._source['presenceCreatedAt'] = params['presenceCreatedAt'];
      ctx._source['totalPresenceGroupEvent'] = params['totalPresenceGroupEvent'];
    `

    const scriptParams = {
        presenceStatus: status.toUpperCase(),
        presenceCreatedAt: new Date().toISOString(),
        totalPresenceGroupEvent,
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

    if (eventGroupId) {
        const scriptSourceTotalPresence = `
            ctx._source['totalPresenceGroupEvent'] = params['totalPresenceGroupEvent'];
        `

        const scriptParamsTotalPresence = {
            totalPresenceGroupEvent,
        }

        esClient?.updateByQuery({
            index,
            body: {
                script: {
                    source: scriptSourceTotalPresence,
                    params: scriptParamsTotalPresence,
                    lang: 'painless',
                },
                query: {
                    bool: {
                        must: [
                            { term: { 'eventGroupId.keyword': eventGroupId } },
                            { term: { 'userId.keyword': userId } },
                        ],
                    },
                },
            },
        })
    }
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
