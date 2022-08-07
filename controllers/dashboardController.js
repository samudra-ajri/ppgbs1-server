import asyncHandler from 'express-async-handler'
import moment from 'moment'
import Completion from '../models/completionModel.js'
import User from '../models/userModel.js'

// @desc    Get dashboard
// @route   GET /api/dashboard
// @access  Private, Managers
const getDashboard = asyncHandler(async (req, res) => {
    let match = {}
    if (Object.keys(req.query).length !== 0) {
        match = { $and: [req.query] }
    }

    const minDatePreteen = (moment().subtract(12, 'years')).toDate()
    const minDateTeen = (moment().subtract(15, 'years')).toDate()
    const minDatePremarried = (moment().subtract(18, 'years')).toDate()
    const maxnDatePremarried = (moment().subtract(30, 'years')).toDate()

    const users = await User.aggregate(
        [
            { $match: match },
            {
                $project: {
                    male: { $cond: [{ $eq: ["$sex", "male"] }, 1, 0] },
                    female: { $cond: [{ $eq: ["$sex", "female"] }, 1, 0] },
                    generus: { $cond: [{ $eq: ["$role", "GENERUS"] }, 1, 0] },
                    pengajar: { $cond: [{ $eq: ["$role", "TEACHER"] }, 1, 0] },
                    preteenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDatePreteen] }, { $gt : ["$birthdate", minDateTeen] }] }, 1, 0] },
                    teenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDateTeen] }, { $gt : ["$birthdate", minDatePremarried] }] }, 1, 0] },
                    premarriedAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDatePremarried] }, { $gte : ["$birthdate", maxnDatePremarried] }] }, 1, 0] }
                }
            },
            {
                $group: {
                    _id: null, 
                    total: { $sum: 1 },
                    generus: { $sum: "$generus" },
                    pengajar: { $sum: "$pengajar" },
                    preteenAge: { $sum: "$preteenAge" },
                    teenAge: { $sum: "$teenAge" },
                    premarriedAge: { $sum: "$premarriedAge" },
										male: { $sum: "$male" },
                    female: { $sum: "$female" },
                }
            }
        ]
    )

    const scores = await Completion.aggregate(
        [
            { $match: match },
            {
                $project: {
                    alquran: { $cond: [{ $eq: ["$category", "ALQURAN"] }, "$poin", 0] },
                    hadits: { $cond: [{ $eq: ["$category", "HADITS"] }, "$poin", 0] },
                    rote: { $cond: [{ $eq: ["$category", "ROTE"] }, "$poin", 0] },
                    extra: { $cond: [{ $eq: ["$category", "EXTRA"] }, "$poin", 0] },
                    total: { $sum: "$poin" },
                }
            },
            {
                $group: {
                    _id: null, 
                    total: { $sum: "$total" },
                    alquran: { $sum: "$alquran" },
                    hadits: { $sum: "$hadits" },
                    rote: { $sum: "$rote" },
                    extra: { $sum: "$extra" },
                }
            }
        ]
    )

    res.status(200).json({
        users: users[0],
        scores: scores[0],
    })
})

export {
    getDashboard
}