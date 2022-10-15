import asyncHandler from 'express-async-handler'
import moment from 'moment'
import Attendance from '../models/attendanceModel.js'
import Event from '../models/eventModel.js'

// @desc    Create new attendance
// @route   POST /api/attendance
// @access  Private
const createAttendance = asyncHandler(async (req, res) => {
    const user = req.user._id
    const { roomId, passCode } = req.body

    const event = await Event.findOne({ roomId })
    if (!event) {
        res.status(404)
        throw new Error('Event not found')
    }
    if (event.passCode !== passCode) {
        res.status(401)
        throw new Error('Kode Akses Salah')
    }

    const userExists = await Attendance.findOne({ roomId, attender: user })
    if (userExists) {
        res.status(403)
        throw new Error('Sudah mengisi daftar hadir')
    }

    const data = {
        roomId,
        classTypes: event.classTypes,
        addedBy: req.user._id,
        attender: req.user._id,
        ds: req.user.ds,
        klp: req.user.klp,
        sex: req.user.sex,
        time: moment().format()
    }

    await Attendance.create(data)
    res.json({ message: 'success' })
})

// @desc    Get attendances
// @route   GET /api/attendances/room/:roomId
// @access  Private, Manager
const getAttendances = asyncHandler(async (req, res) => {
    const { roomId } = req.params
    const attendances = await Attendance.find({ roomId })
        .populate({
            path: 'attender',
            model: 'User',
            select: ['name']
        })
        .sort('-createdAt')
    if (attendances) {
        res.json({ attendances, total: attendances.length })
    } else {
        res.status(404)
        throw new Error('Attendances not found')
    }
})

// @desc    Check if the logged user is already attended
// @route   GET /api/attendances/event/:roomId/isattended
// @access  Private
const isAttended = asyncHandler(async (req, res) => {
    const { roomId } = req.params
    const event = await Event.findOne({ roomId })
    if (!event) {
        res.status(404)
        throw new Error('Event not found')
    }
    const attendance = await Attendance.findOne({ roomId, attender: req.user._id })
    const isAttended = attendance ? true : false
    const time = attendance?.time
    res.json({ isAttended, time })
})

export { 
    createAttendance,
    getAttendances,
    isAttended
}