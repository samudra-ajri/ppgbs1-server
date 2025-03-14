const asyncHandler = require('express-async-handler')
const eventService = require('./eventService')
const eventConstant = require('../../../constants/eventConstant')
const { logger } = require('../../../utils/loggerUtils')
const loggerStatusConstant = require('../../../constants/loggerStatusConstant')
const { paginate } = require('../../../utils/paginationUtils')

const eventController = {}

// @desc    create event
// @route   POST /events
// @access  Protect, Admin
eventController.create = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.create.event
    const data = {
        session: req.auth.data,
        payload: req.body,
    }
    await eventService.createEvent(data)
    res.status(201).json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS, message: null, statusCode: 201 })
})

// @desc    list event
// @route   GET /events
// @access  Protect
eventController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.list.event
    const { organizationIds, roomId, groupId, isGroupHead } = req.query
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const session = req.auth.data
    const filters = {
        organizationIds: organizationIds?.split(','),
        roomId,
        groupId,
        isGroupHead,
    }

    const { data, total } = await eventService.getEvents(session, filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    list top events (top 20)
// @route   GET /events/top
// @access  Protect
eventController.topList = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.toplist.event
    const session = req.auth.data
    const data = await eventService.getTopEvents(session)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    event detail
// @route   GET /events/:id
// @access  Protect
eventController.detail = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.detail.event
    const session = req.auth.data
    const data = await eventService.getEvent(session, req.params.id)

    if (data.isGroupHead) {
        const { data: graoupedData } = await eventService.getEvents(session, { groupId: data.id }, null, 1, 100, `"startDate" ASC`)
        data.groupEvents = graoupedData
    }

    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    delete event
// @route   DELETE /events/:id
// @access  Protect, Admin
eventController.delete = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.delete.event
    const session = req.auth.data
    const { id } = req.params
    await eventService.deleteEvent(session, id)
    res.json({ id })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = eventController