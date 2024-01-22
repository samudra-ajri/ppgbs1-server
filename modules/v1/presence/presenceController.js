const asyncHandler = require('express-async-handler')
const presenceService = require('./presenceService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')
const presenceStatusConstant = require('../../../constants/presenceStatusConstant')

const presenceController = {}

// @desc    create presence
// @route   POST /events/:eventId/presences
// @access  Protect
presenceController.create = asyncHandler(async (req, res) => {
    req.event = eventConstant.presence.create.event
    req.body.status = presenceStatusConstant.HADIR // TODO: IZIN, ALPHA

    const session = req.auth.data
    const { eventId } = req.params
    const { status, passcode } = req.body
    const data = { session, eventId, status, passcode }

    await presenceService.create(data)
    res.status(201).json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS, message: null, statusCode: 201 })
})

// @desc    event presence list
// @route   GET /events/:eventId/presences
// @access  Protect, Admin
presenceController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.presence.list.event
    const { eventId } = req.params
    const { sex, ancestorOrganizationId, organizationId } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const filters = { eventId, sex, ancestorOrganizationId, organizationId }

    const { data, total } = await presenceService.getPresences(filters, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    event presence detail
// @route   GET /events/:eventId/presences/:userId
// @access  Protect
presenceController.detail = asyncHandler(async (req, res) => {
    req.event = eventConstant.presence.detail.event
    const { userId, eventId } = req.params
    const data = await presenceService.getPresence(userId, eventId)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    create presence by admin
// @route   POST /events/:eventId/presences/:userId
// @access  Protect, Admin
presenceController.createByAdmin = asyncHandler(async (req, res) => {
    req.event = eventConstant.presence.createByAdmin.event
    req.body.status = presenceStatusConstant.HADIR // TODO: IZIN, ALPHA

    const session = req.auth.data
    const { eventId, userId } = req.params
    const { status } = req.body

    const data = { session, eventId, status, userId }
    await presenceService.create(data)
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    delete event presence
// @route   DELETE /events/:eventId/presences/:userId
// @access  Protect, Admin
presenceController.delete = asyncHandler(async (req, res) => {
    req.event = eventConstant.presence.delete.event

    const session = req.auth.data
    const { userId, eventId } = req.params

    await presenceService.delete(session, eventId, userId)
    res.json({ userId, eventId })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    event presence download as excel
// @route   GET /events/:eventId/presences/download
// @access  Protect, Admin
presenceController.download = asyncHandler(async (req, res) => {
    req.event = eventConstant.presence.download.event
    const { eventId } = req.params
    const { sex, ancestorOrganizationId, organizationId } = req.query
    const filters = { eventId, sex, ancestorOrganizationId, organizationId }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="presensi-${eventId}.xlsx"`)
    await presenceService.exportDataAsExcel(res, filters)

    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = presenceController