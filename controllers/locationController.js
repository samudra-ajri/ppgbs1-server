import asyncHandler from 'express-async-handler'
import Location from '../models/locationModel.js'
import sortQuery from '../utils/sortQuery.js'

// @desc    Create new location
// @route   POST /api/locations
// @access  Private/Admin
const createLocation = asyncHandler(async (req, res) => {
    const { ds, klp } = req.body
    const exists = await Location.findOne({ ds })
    if (exists) {
        res.status(404)
        throw new Error('Ds already added')
    }

    const location = await Location.create({ ds, klp })
    if (location) {
        res.status(201).json(location._doc)
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = asyncHandler(async (req, res) => {
    const locations = await Location.find({}).sort('ds')
    res.status(200).json({ total: locations.length, locations })
})

// @desc    Get location by id
// @route   GET /api/locations/:id
// @access  Public
const getLocation = asyncHandler(async (req, res) => {
    const location = await Location.findById(req.params.id)
    if (location) {
        res.status(200).json(location)
    } else {
        res.status(400)
        throw new Error('Location not found')
    }
})

// @desc    Ubdate a location
// @route   PUT /api/locations/:id
// @access  Private/Admin
const updateLocation = asyncHandler(async (req, res) => {
    const location = await Location.findById(req.params.id)
    if (location) {
        location.ds  = req.body.ds || location.ds
        location.klp = req.body.klp || location.klp
        
        const updatedLocation = await location.save()
        res.status(200).json(updatedLocation)
    } else {
        res.status(400)
        throw new Error('Location not found')
    }
})

// @desc    Delete a location
// @route   Delete /api/location/:id
// @access  Private/Admin
const deleteLocation = asyncHandler(async (req, res) => {
    const location = await Location.findById(req.params.id)
    if (location) {
        await location.remove()
        res.status(200).json({ id: req.params.id })
    } else {
        res.status(400)
        throw new Error('Location not found')
    }
})

export { 
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation
}