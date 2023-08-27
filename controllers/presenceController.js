import asyncHandler from 'express-async-handler'
import moment from 'moment'
import mongoose from 'mongoose'
import roleTypes from '../consts/roleTypes.js'
import Presence from '../models/presenceModel.js'
import eventTypes from '../consts/eventTypes.js'
import loggerUtils from '../utils/logger.js'
import loggerStatus from '../consts/loggerStatus.js'
import throwError from '../utils/errorUtils.js'
import User from '../models/userModel.js'

// @desc    Create new presence
// @route   POST /api/presences
// @access  Private
const createPresence = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.presence.create
    req.event = eventLogger.event

    const { roomId, passCode } = req.body
    const presence = await Presence.findOne({ roomId })
    if (presence) {
        const user = req.user._id
        const userExists = presence.attenders.some(
            attender => String(attender.user) === String(user)
        )

        if (presence.passCode !== passCode) throwError(eventLogger.message.failed.wrongAccessCode, 401)
        if (userExists) throwError(eventLogger.message.failed.alreadyExists, 403)
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
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.eventNotFound, 404)
    }
})

// @desc    Create new presence by admin
// @route   POST /api/presences/admin
// @access  Private, Manager
const createPresenceByAdmin = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.presence.createByAdmin
    req.event = eventLogger.event

    const { roomId, userId } = req.body

    const user = await User.findById(userId).select('-password')
    if (!user) throwError(eventLogger.message.failed.userNotFound, 404)

    const presence = await Presence.findOne({ roomId })
    if (presence) {
        const userId = user._id
        const userExists = presence.attenders.some(
            attender => String(attender.user) === String(userId)
        )
        if (userExists) throwError(eventLogger.message.failed.alreadyExists, 403)
        const attender = {
            user: userId,
            ds: user.ds,
            klp: user.klp,
            sex: user.sex,
            time: moment().format(),
            createdBy: req.user._id
        }

        presence.attenders.push(attender)
        await presence.save()
        res.json({ message: 'Presence success' })

        req.body.attender = {
            _id: userId,
            name: user.name,
            birthdate: user.birthdate,
            ds: attender.ds,
            klp: attender.klp,
            sex: attender.sex,
        }

        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.eventNotFound, 404)
    }
})

// @desc    Remove a presence attender
// @route   DELETE /api/presences/room/:roomId/attender/:attenderId
// @access  Private, Manager
const removeAttender = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.presence.deleteAttender
    req.event = eventLogger.event

    const { roomId, attenderId } = req.params

    const user = await User.findById(attenderId).select('-password')
    if (!user) throwError(eventLogger.message.failed.userNotFound, 404)

    Presence.updateOne(
        { roomId },
        { $pull: { attenders: { 'user': mongoose.Types.ObjectId(attenderId) } } },
        (err, result) => {
            if (err) throwError(eventLogger.message.failed.eventNotFound, 404)
        }
    )

    req.body.deletedAttender = {
        _id: attenderId,
        name: user.name,
        birthdate: user.birthdate,
        ds: user.ds,
        klp: user.klp,
        sex: user.sex,
    }

    res.json({ id: attenderId })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get presences
// @route   GET /api/presences
// @access  Private, Manager
const getPresences = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.presence.list
    req.event = eventLogger.event

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
        res.json({ presences })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Get presence by room id
// @route   GET /api/presences/room/:roomId?page=&size=
// @access  Private, Manager
const getPresencesByRoomId = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.presence.detail
    req.event = eventLogger.event

    const { page = 1, size = 20 } = req.query
    const presence = await Presence.findOne({ roomId: req.params.roomId })
        .populate({
            path: 'attenders.user',
            model: 'User',
            select: ['name']
        })
    if (presence) {
        res.json({ attenders: presence.attenders.slice((page - 1) * size, page * size), total: presence.attenders.length })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Check if the logged user is present
// @route   GET /api/presences/event/:roomId/ispresent
// @access  Private
const isPresent = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.presence.isPresent
    req.event = eventLogger.event

    const presences = await Presence.findOne({ roomId: req.params.roomId })
    if (presences) {
        const attender = presences.attenders.find(attender => attender.user == String(req.user._id))
        const isPresent = attender ? true : false
        const time = attender?.time
        res.json({ isPresent, time })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

export {
    createPresence,
    getPresences,
    getPresencesByRoomId,
    isPresent,
    createPresenceByAdmin,
    removeAttender,
}