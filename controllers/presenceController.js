import asyncHandler from 'express-async-handler'
import moment from 'moment'
import roleTypes from '../consts/roleTypes.js'
import Presence from '../models/presenceModel.js'

// @desc    Create new presence
// @route   POST /api/presences
// @access  Private
const createPresence = asyncHandler(async (req, res) => {
    const { roomId, passCode } = req.body
    const presence = await Presence .findOne({ roomId })
    if (presence) {
        const user = req.user._id
        const userExists = presence.attenders.some(
            attender => String(attender.user) === String(user)
        )

        if (presence.passCode !== passCode) {
            res.status(401)
            throw new Error('Kode Akses Salah')
        }

        if (userExists) {
            res.status(403)
            throw new Error('Sudah mengisi daftar hadir')
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
        throw new Error('Event not found')
    }
})

// @desc    Get presences
// @route   GET /api/presences
// @access  Private, Manager
const getPresences = asyncHandler(async (req, res) => {
    const filters = []
    if (req.user.role === roleTypes.PPK) filters.push({ klp: req.user.klp }, { $and: [{ ds: req.user.ds }, { klp: undefined }] }, { $and: [{ ds: undefined }, { klp: undefined }] })
    if (req.user.role === roleTypes.PPD) filters.push({ $and: [{ ds: req.user.ds }] }, { $and: [{ ds: undefined }, { klp: undefined }] })
    
    const match = () => {
        if (req.user.role === roleTypes.PPG || req.user.role === roleTypes.ADMIN) return {}
        return { $or: filters } 
    }

    const presences = await Presence.find(match())
        .populate({
            path: 'attenders.user',
            model: 'User',
            select: ['name']
        }).sort('-createdAt')
    if (presences) {
        res.json({presences})
    } else {
        res.status(404)
        throw new Error('Presence not found')
    }
})

// @desc    Get presence by room id
// @route   GET /api/presences/event/:roomId?page=&size=
// @access  Private, Manager
const getPresencesByRoomId = asyncHandler(async (req, res) => {
    const { page=1, size=20 } = req.query
    const presence = await Presence.findOne({ roomId: req.params.roomId})
        .populate({
            path: 'attenders.user',
            model: 'User',
            select: ['name']
        })
    if (presence) {
        res.json({attenders: presence.attenders.slice((page-1)*size, page*size), total: presence.attenders.length})
    } else {
        res.status(404)
        throw new Error('Presence not found')
    }
})

// @desc    Check if the logged user is present
// @route   GET /api/presences/event/:roomId/ispresent
// @access  Private
const isPresent = asyncHandler(async (req, res) => {
    const presences = await Presence.findOne({ roomId: req.params.roomId})
    if (presences) {
        const attender = presences.attenders.find(attender => attender.user == String(req.user._id))
        const isPresent = attender ? true : false
        const time = attender?.time
        res.json({ isPresent, time })
    } else {
        res.status(404)
        throw new Error('Presence not found')
    }
})

export { 
    createPresence,
    getPresences,
    getPresencesByRoomId,
    isPresent
}