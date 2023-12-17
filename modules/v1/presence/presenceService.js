const eventConstant = require('../../../constants/eventConstant')
const { throwError } = require('../../../utils/errorUtils')
const presenceRepository = require('./presenceRepository')

const presenceService = {}

presenceService.create = async (payload) => {
    const event = eventConstant.presence.create
    const { session, eventId, status, passcode, userId } = payload
    const isCreatedByAdmin = userId ? true : false
    const foundUserId = isCreatedByAdmin ? userId : session.id

    const foundEventDetail = await presenceRepository.findEvent(eventId)
    if (!foundEventDetail) throwError(event.message.failed.eventNotFound, 404)
    if (!isCreatedByAdmin && foundEventDetail.passcode !== passcode) throwError(event.message.failed.wrongAccessCode, 403)

    const presence = await presenceRepository.findPresence(foundUserId, eventId)
    if (presence) throwError(event.message.failed.alreadyExists, 403)

    const data = {
        userId: foundUserId,
        eventId,
        status,
        createdBy: session.id
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

presenceService.delete = async (session, eventId, userId) => {
    const deletedBy = session.id
    await presenceRepository.deletePresence(eventId, userId, deletedBy)
}

module.exports = presenceService
