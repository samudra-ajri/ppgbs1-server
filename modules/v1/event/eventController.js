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
    res.json({ message: 'SUCCESS' })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    list event
// @route   GET /events
// @access  Protect
eventController.list = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.list.event
    const { organizationIds, roomId } = req.query
    const { search } = req.query
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 20
    const session = req.auth.data
    const filters = { 
        organizationIds: organizationIds?.split(','),
        roomId,
    }

    const { data, total } = await eventService.getEvents(session, filters, search, page, pageSize)
    const metadata = paginate({ page, pageSize, count: data.length, totalCount: total[0].count })
    res.json({ ...metadata, data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

// @desc    event detail
// @route   GET /events/:id
// @access  Protect
eventController.detail = asyncHandler(async (req, res) => {
    req.event = eventConstant.event.detail.event
    const data = await eventService.getEvent(req.params.id)
    res.json({ data })
    logger({ req, status: loggerStatusConstant.SUCCESS })
})

module.exports = eventController