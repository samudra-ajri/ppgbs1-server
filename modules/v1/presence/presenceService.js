const ExcelJS = require('exceljs')
const eventConstant = require('../../../constants/eventConstant')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const { throwError } = require('../../../utils/errorUtils')
const presenceRepository = require('./presenceRepository')
const presenceStatusConstant = require('../../../constants/presenceStatusConstant')
const presenceElasticsearchRepository = require('./presenceElasticsearchRepository')

const presenceService = {}

presenceService.create = async (payload) => {
    const event = eventConstant.presence.create
    const { session, eventId, status, passcode, userId } = payload
    const isCreatedByAdmin = userId ? true : false
    const foundUserId = isCreatedByAdmin ? userId : session.id

    if (isCreatedByAdmin && session.position.type === positionTypesConstant.GENERUS) {
        throwError(event.message.failed.unauthorized, 403)
    }

    const foundEventDetail = await presenceRepository.findEvent(eventId)
    if (!foundEventDetail) throwError(event.message.failed.eventNotFound, 404)
    if (!isCreatedByAdmin && foundEventDetail.passcode !== passcode) throwError(event.message.failed.wrongAccessCode, 403)

    const presence = await presenceRepository.findPresence(foundUserId, eventId)
    if (presence?.status === presenceStatusConstant.HADIR) throwError(event.message.failed.alreadyExists, 403)

    const data = {
        userId: foundUserId,
        eventId,
        status,
        createdBy: session.id
    }
    await presenceRepository.insertPresence(data)
    const [eventPresence] = await presenceRepository.getEventPresence(eventId, foundUserId)

    if (presence) {
        presenceElasticsearchRepository.updatePresenceStatus(eventPresence)
    } else {
        presenceElasticsearchRepository.insert(eventPresence)
    }
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
    const event = eventConstant.presence.delete
    const presence = await presenceRepository.findPresence(userId, eventId)
    if (session.position.type !== positionTypesConstant.ADMIN && session.id !== Number(presence.createdBy)) throwError(event.message.failed.unauthorized, 403)
    await presenceRepository.deletePresence(eventId, userId)
    presenceElasticsearchRepository.deletePresence(eventId, userId)
}

presenceService.findEvent = async (eventId) => {
    const event = eventConstant.presence.download
    const foundEventDetail = await presenceRepository.findEvent(eventId)
    if (!foundEventDetail) throwError(event.message.failed.eventNotFound, 404)
    return foundEventDetail
}

presenceService.exportDataAsExcel = async (res, filters) => {
    const event = eventConstant.presence.download

    try {
        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: res,
        })
        const worksheet = workbook.addWorksheet('presensi')
        worksheet.columns = [
            { header: 'Timestamp (WIB)', key: 'createdAt', width: 20 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Nama', key: 'userName', width: 30 },
            { header: 'L/P', key: 'userSex', width: 5 },
            { header: 'PPD', key: 'ancestorOrgName', width: 25 },
            { header: 'PPK', key: 'organizationName', width: 25 },
        ]

        const dataStream = await presenceRepository.queryStream(filters)
        for await (const row of dataStream) {
            row.createdAt = row.createdAt.toLocaleString('id-ID', excelDateTimeOptions)
            worksheet.addRow(row).commit()
        }

        await workbook.commit()
    } catch (error) {
        throwError(event.message.failed.errorGenerating, 500)
    }
}

presenceService.update = async (data) => {
    const event = eventConstant.presence.update
    const { eventId, userId } = data
    const presence = await presenceRepository.findPresence(userId, eventId)
    if (!presence) throwError(event.message.failed.notFound, 404)
    await presenceRepository.update(data)
    presenceElasticsearchRepository.updatePresenceStatus(data)
}

const excelDateTimeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
}

module.exports = presenceService
