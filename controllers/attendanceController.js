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
        birthdate: req.user.birthdate,
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
    const { page = 1, limit = 20, search } = req.query;
    const minDatePreteen = (moment().subtract(12, 'years')).toDate()
	const minDateTeen = (moment().subtract(15, 'years')).toDate()
	const minDatePremarried = (moment().subtract(18, 'years')).toDate()
	const maxnDatePremarried = (moment().subtract(30, 'years')).toDate()
    
    const attendances = await Attendance.find({ roomId })
        .populate({
            path: 'attender',
            model: 'User',
            select: ['name', 'birthdate']
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort('-createdAt')
        
    if (attendances) {
        const count = (await Attendance.aggregate([
            { $match: { roomId } },
            {
                $project: {
                    male: { $cond: [{ $eq: ["$sex", "male"] }, 1, 0] },
                    female: { $cond: [{ $eq: ["$sex", "female"] }, 1, 0] },
                    preteenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDatePreteen] }, { $gt: ["$birthdate", minDateTeen] }] }, 1, 0] },
                    teenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDateTeen] }, { $gt: ["$birthdate", minDatePremarried] }] }, 1, 0] },
                    premarriedAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDatePremarried] }, { $gte: ["$birthdate", maxnDatePremarried] }] }, 1, 0] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    preteenAge: { $sum: "$preteenAge" },
                    teenAge: { $sum: "$teenAge" },
                    premarriedAge: { $sum: "$premarriedAge" },
                    male: { $sum: "$male" },
                    female: { $sum: "$female" },
                }
            }
        ]))[0]

        res.json({ attendances, count })
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