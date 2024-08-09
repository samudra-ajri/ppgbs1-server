const directoryType = require('../../../constants/directoryType')
const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const directoryRepository = require('./directoryRepository')

const directoryService = {}

directoryService.getDirectories = async (filters, search, page, pageSize) => {
    const { data, total } = await directoryRepository.findAll(filters, search, page, pageSize)
    return { data, total }
}

directoryService.createDirectory = async ({ payload }) => {
    const event = eventConstant.directory.create

    const { name, url, description, type } = payload
    const exists = await directoryRepository.findByName(name)
    if (exists.length) throwError(event.message.failed.alreadyExists, 400)
    if (type && ![directoryType.PRIVATE, directoryType.PUBLIC].includes(type)) throwError(event.message.failed.invalidType, 400)

    const data = { name, url, description, type }
    await directoryRepository.insert(data)
}

directoryService.deleteDirectory = async (id) => {
    await directoryRepository.delete(id)
}

module.exports = directoryService
