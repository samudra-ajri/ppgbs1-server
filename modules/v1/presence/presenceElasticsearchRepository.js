const esClient = require('../../../pkg/esClient')

const presenceElasticsearchRepository = {}

const now = new Date()
const month = now.getMonth() + 1
const year = now.getFullYear()
const index = `pigaru-olap-presences.${month}.${year}`

presenceElasticsearchRepository.insert = (data) => {
    esClient.index({
        index,
        body: data,
    })
}

module.exports = presenceElasticsearchRepository
