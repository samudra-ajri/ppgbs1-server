import asyncHandler from 'express-async-handler'
import moment from 'moment'
import Presence from '../models/presenceModel.js'

// @desc    Create new presence
// @route   POST /api/presences
// @access  Private
const createPresence = asyncHandler(async (req, res) => {
    const { roomId } = req.body
    const presence = await Presence .findOne({ roomId })
    if (presence) {
        const user = req.user._id
        const userExists = presence.attenders.some(
            attender => String(attender.user) === String(user)
        )

        if (userExists) {
            res.status(403)
            throw new Error('User already present')
        }

        const attender = {
            user,
            ds: req.user.ds,
            klp: req.user.klp,
            sex: req.user.sex,
            time: moment().format()
        }

        presence.attenders.push(attender)
        await presence.save()
        res.json({ message: 'Presence success' })
    } else {
        res.status(404)
        throw new Error('event not found')
    }
})

// @desc    Get presences
// @route   GET /api/presences
// @access  Private, Manager
const getPresences = asyncHandler(async (req, res) => {
    const presences = await Presence.find({})
        .populate({
            path: 'attenders.user',
            model: 'User',
            select: ['name']
        })
    if (presences) {
        res.json({presences})
    } else {
        res.status(404)
        throw new Error('Presence not found')
    }
})

// @desc    Get presence by room id
// @route   GET /api/presences/event/:roomId
// @access  Private, Manager
const getPresencesByRoomId = asyncHandler(async (req, res) => {
    const presences = await Presence.findOne({ roomId: req.params.roomId})
        .populate({
            path: 'attenders.user',
            model: 'User',
            select: ['name']
        })
    if (presences) {
        res.json(presences)
    } else {
        res.status(404)
        throw new Error('Presence not found')
    }
})

export { 
    createPresence,
    getPresences,
    getPresencesByRoomId
}