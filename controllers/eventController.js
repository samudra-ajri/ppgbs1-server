import asyncHandler from 'express-async-handler'
import moment from 'moment'
import roleTypes from '../consts/roleTypes.js'
import Event from '../models/eventModel.js'

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
    const { name, passCode, classType, startDate, endDate } = req.body
    const roomId = parseInt(Math.random().toFixed(10).replace("0.",""))

    let ds = undefined
    let klp = undefined
    if (req.user.role === roleTypes.PPD) ds = req.user.ds
    if (req.user.role === roleTypes.PPK) ds = req.user.ds, klp = req.user.klp

    const event = await Event.create({ name, roomId, passCode, classType, ds, klp, startDate, endDate })
    if (event) {
        res.status(201).json(event._doc)
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    List events based on user logged in
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
    const endPresence = moment().subtract(1, 'hours')
    const events = await Event.find({ 
        $and : [
            { endDate: { $gte: endPresence.format() } },
            { $or : [
                { klp: req.user.klp },
                { $and: [
                    { ds: req.user.ds },
                    { klp: undefined }
                ] },
                { $and: [
                    { ds: undefined },
                    { klp: undefined }
                ] }
            ] }
        ]
    }).sort('startDate')
    if (events) {
        res.status(201).json({ total: events.length, events })
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    List all events
// @route   GET /api/events/all
// @access  Private, Admin
const getAllEvents = asyncHandler(async (req, res) => {
    const now = moment();
    const events = await Event.find({}).sort('startDate')
    if (events) {
        res.status(201).json({ total: events.length, events })
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    Get an event
// @route   GET /api/events/:id
// @access  Private, Admin
const getEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (event) {
        res.status(201).json(event)
    } else {
        res.status(404)
        throw new Error('Not found')
    }
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private, Admin
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (event) {
        event.name = req.body.name || event.name
        event.passCode = req.body.passCode || event.passCode
        event.classType = req.body.classType || event.classType
        event.startDate = req.body.startDate || event.startDate
        event.endDate = req.body.endDate || event.endDate
        await event.save()
        res.status(201).json(event)
    } else {
        res.status(404)
        throw new Error('Not found')
    }
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private, Admin
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (event) {
        await event.remove()
        res.status(200).json({ id: req.params.id })
    } else {
        res.status(404)
        throw new Error('Not found')
    }
})

export { 
    createEvent,
    getEvents,
    getAllEvents,
    getEvent,
    updateEvent,
    deleteEvent
}