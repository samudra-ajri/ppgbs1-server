import asyncHandler from 'express-async-handler'
import moment from 'moment'
import roleTypes from '../consts/roleTypes.js'
import Attendance from '../models/attendanceModel.js'
import Event from '../models/eventModel.js'
import Presence from '../models/presenceModel.js'

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
    const { name, passCode, classTypes, startDate, endDate, location } = req.body
    const roomIdSlug = `${parseInt(Math.random().toFixed(3).replace("0.",""))}-${parseInt(Math.random().toFixed(3).replace("0.",""))}-${parseInt(Math.random().toFixed(4).replace("0.",""))}`
    const roomId = roomIdSlug.split('-').join('')

    let ds = undefined
    let klp = undefined
    if (req.user.role === roleTypes.PPD) ds = req.user.ds
    if (req.user.role === roleTypes.PPK) ds = req.user.ds, klp = req.user.klp

    const event = await Event.create({ name, roomId, roomIdSlug, passCode, classTypes, ds, klp, startDate, endDate, location })
    if (event) {
        await Presence.create({ roomId, classTypes, passCode, ds, klp })
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
    const endPresence = moment().subtract(8, 'hours')
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
    }).sort('-createdAt').select('-passCode')
    if (events) {
        res.status(201).json({ total: events.length, events })
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    List all events
// @route   GET /api/events/admin
// @access  Private, Manager
const getAllEvents = asyncHandler(async (req, res) => {
    const filters = []
    const endshow = moment().subtract(1, 'years')
    if (req.user.role === roleTypes.PPK) filters.push({ klp: req.user.klp }, { $and: [{ ds: req.user.ds }, { klp: undefined }] }, { $and: [{ ds: undefined }, { klp: undefined }] })
    if (req.user.role === roleTypes.PPD || req.user.role === roleTypes.MT || req.user.role === roleTypes.MS) filters.push({ $and: [{ ds: req.user.ds }] }, { $and: [{ ds: undefined }, { klp: undefined }] })
    
    const match = () => {
        if (req.user.role === roleTypes.PPG || req.user.role === roleTypes.ADMIN) return { endDate: { $gte: endshow.format() }}
        return { $and : [
            { endDate: { $gte: endshow.format() } }, 
            { $or: filters } 
        ] }
    }
    const events = await Event.find(match()).sort('-createdAt')
    if (events) {
        res.status(201).json({ total: events.length, events })
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    Get an event
// @route   GET /api/events/:id
// @access  Private
const getEvent = asyncHandler(async (req, res) => {
    let event = {}
    if (req.user.role === roleTypes.GENERUS) {
        event = await Event.findById(req.params.id).select('-passCode')
    } else {
        event = await Event.findById(req.params.id)
    }
    if (event.id) {
        res.status(201).json(event)
    } else {
        res.status(404)
        throw new Error('Not found')
    }
})

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private, Manager
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (event) {
        event.name = req.body.name || event.name
        event.passCode = req.body.passCode || event.passCode
        event.classTypes = req.body.classTypes || event.classTypes
        event.startDate = req.body.startDate || event.startDate
        event.endDate = req.body.endDate || event.endDate
        event.location = req.body.location || event.location
        await event.save()

        if (req.body.classTypes) {
            const presence = await Presence.findOne({ roomId: event.roomId})
            presence.classTypes = event.classTypes
        }
        
        res.status(201).json(event)
    } else {
        res.status(404)
        throw new Error('Not found')
    }
})

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private, Manager
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
    if (event) {
        await Presence.findOne({ roomId: event.roomId }).remove()
        await Attendance.findOne({ roomId: event.roomId }).remove()
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