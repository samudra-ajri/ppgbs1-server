const esClient = require('../../../pkg/esClient')

const eventElasticsearchRepository = {}

const now = new Date()
const month = now.getMonth() + 1
const year = now.getFullYear()

eventElasticsearchRepository.bulkEventPresence = (data) => {
    const index = `pigaru-olap-presences.${month}.${year}`
    const timestamp = new Date().toISOString()
    const transformedData = data.map((item) => {
        return {
            ...item,
            eventEndDate: new Date(Number(item.eventEndDate)).toISOString(),
            eventStartDate: new Date(Number(item.eventStartDate)).toISOString(),
            presenceCreatedAt: new Date(Number(item.presenceCreatedAt)).toISOString(),
            timestamp,
        }
    })

    const body = transformedData.flatMap(item => [{ index: { _index: index } }, item])
    esClient?.bulk({ body })
}

eventElasticsearchRepository.deleteEventPresence = (eventId) => {
    const index = `pigaru-olap-presences.${month}.${year}`

    esClient?.deleteByQuery({
        index,
        body: {
            query: {
                bool: {
                    must: [
                        { term: { 'eventId.keyword': eventId } },
                    ],
                },
            },
        },
    })
}

module.exports = eventElasticsearchRepository
