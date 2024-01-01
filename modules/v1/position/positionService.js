const positionRepository = require('./positionRepository')

const positionService = {}

positionService.getPositions = async (filters, page, pageSize) => {
    const { data, total } = await positionRepository.findAll(filters, page, pageSize)
    return { data, total }
}

module.exports = positionService
