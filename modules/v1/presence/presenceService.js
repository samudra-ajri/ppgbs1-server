const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const presenceRepository = require('./presenceRepository')

const presenceService = {}

presenceService.create = async (session, eventId, status) => {
    const event = eventConstant.presence.create
    const presence = await presenceRepository.findPresence(session.id, eventId)
    if (presence) throwError(event.message.failed.alreadyExists, 403)
    const data = {
        userId: session.id,
        eventId,
        status,
    }
    await presenceRepository.insertPresence(data)
}

presenceService.getPresences = async (filters, page, pageSize) => {
    const { data, total } = await presenceRepository.findAll(filters, page, pageSize)
    return { data, total }
}

presenceService.getPresence = async (userId, eventId) => {
    const event = eventConstant.presence.detail
    const presence = await presenceRepository.findOneiWithUser(userId, eventId)
    if (!presence) throwError(event.message.failed.notFound, 404)
    return presence
}

module.exports = presenceService
