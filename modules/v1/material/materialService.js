const materialRepository = require('./materialRepository')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const Redis = require('../../../pkg/redis')
const { makeRedisKey } = require('../../../utils/stringUtils')

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

materialService.getMaterialStructure = async () => {
    const key = makeRedisKey('material')
    const redisData = await Redis.get(key)
    if (redisData) return JSON.parse(redisData)
    
    const structure = await materialRepository.getStructure()
    Redis.store(key, JSON.stringify(structure), 28800) // ttl: 8 hours
    return structure
}

module.exports = materialService
