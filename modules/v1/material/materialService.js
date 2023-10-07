const materialRepository = require('./materialRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')

const materialService = {}

materialService.getMaterials = async (filters, page, pageSize) => {
    const { data, total } = await materialRepository.findAll(filters, page, pageSize)
    return { data, total }
}

module.exports = materialService
