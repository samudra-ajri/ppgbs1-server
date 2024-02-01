const ExcelJS = require('exceljs')
const eventConstant = require('../../../constants/eventConstant')
const positionTypesConstant = require('../../../constants/positionTypesConstant')
const { throwError } = require('../../../utils/errorUtils')
const presenceRepository = require('./presenceRepository')

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
    const event = eventConstant.presence.delete
    const presence = await presenceRepository.findPresence(userId, eventId)
    if (session.position.type !== positionTypesConstant.ADMIN && session.id !== Number(presence.createdBy)) throwError(event.message.failed.unauthorized, 403)
    await presenceRepository.deletePresence(eventId, userId)
}

presenceService.exportDataAsExcel = async (res, filters) => {
    const event = eventConstant.presence.download

    const foundEventDetail = await presenceRepository.findEvent(filters.eventId)
    if (!foundEventDetail) throwError(event.message.failed.eventNotFound, 404)

    try {
        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: res,
        })
        const worksheet = workbook.addWorksheet('presensi')
        worksheet.columns = [
            { header: 'Timestamp', key: 'createdAt' },
            { header: 'Nama', key: 'userName' },
            { header: 'L/P', key: 'userSex' },
            { header: 'PPD', key: 'ancestorOrgName' },
            { header: 'PPK', key: 'organizationName' },
        ]

        const dataStream = await presenceRepository.queryStream(filters)
        for await (const row of dataStream) {
            row.createdAt = new Intl.DateTimeFormat('default', excelDateTimeOptions).format(row.createdAt)
            worksheet.addRow(row).commit()
        }

        await workbook.commit()
    } catch (error) {
        throwError(event.message.failed.errorGenerating, 500)
    }
}

const excelDateTimeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
}

module.exports = presenceService
