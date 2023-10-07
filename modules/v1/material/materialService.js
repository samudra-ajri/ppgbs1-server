const materialRepository = require('./materialRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')

const materialService = {}

materialService.getMaterials = async (filters, page, pageSize) => {
    const { data, total } = await materialRepository.findAll(filters, page, pageSize)
    return { data, total }
}

materialService.getMaterial = async (id) => {
    const event = eventConstant.material.detail
    const material = await materialRepository.find(id)
    if (!material) throwError(event.message.failed.notFound, 404)
    return material
}

module.exports = materialService
