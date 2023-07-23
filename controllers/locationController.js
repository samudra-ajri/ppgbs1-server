import asyncHandler from 'express-async-handler'
import Location from '../models/locationModel.js'
import eventTypes from '../consts/eventTypes.js'
import loggerUtils from '../utils/logger.js'
import loggerStatus from '../consts/loggerStatus.js'
import throwError from '../utils/errorUtils.js'

// @desc    Create new location
// @route   POST /api/locations
// @access  Private/Admin
const createLocation = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.location.create
    req.event = eventLogger.event

    const { ds, klp } = req.body
    const exists = await Location.findOne({ ds })
    if (exists) {
        throwError(eventLogger.message.failed.alreadyExists, 403)
    }

    const location = await Location.create({ ds, klp })
    if (location) {
        res.status(201).json(location._doc)
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.invalidData, 400)
    }
})

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.location.list
    req.event = eventLogger.event

    const locations = await Location.find({}).sort('ds')
    res.status(200).json({ total: locations.length, locations })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get location by id
// @route   GET /api/locations/:id
// @access  Public
const getLocation = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.location.detail
    req.event = eventLogger.event

    const location = await Location.findById(req.params.id)
    if (location) {
        res.status(200).json(location)
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Ubdate a location
// @route   PUT /api/locations/:id
// @access  Private/Admin
const updateLocation = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.location.update
    req.event = eventLogger.event

    const location = await Location.findById(req.params.id)
    if (location) {
        location.ds  = req.body.ds || location.ds
        location.klp = req.body.klp || location.klp
        
        const updatedLocation = await location.save()
        res.status(200).json(updatedLocation)
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Delete a location
// @route   Delete /api/location/:id
// @access  Private/Admin
const deleteLocation = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.location.delete
    req.event = eventLogger.event

    const location = await Location.findById(req.params.id)
    if (location) {
        await location.remove()
        res.status(200).json({ id: req.params.id })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

export { 
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation
}