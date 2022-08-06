import asyncHandler from 'express-async-handler'
import moment from 'moment'
import Completion from '../models/completionModel.js'
import User from '../models/userModel.js'
import filterLocation from '../utils/filterLocation.js'

// @desc    Get dashboard
// @route   GET /api/users/roles?ds=&klp=
// @access  Private, Managers
const getDashboard = asyncHandler(async (req, res) => {
    const minDatePreteen = (moment().subtract(12, 'years')).toDate()
    const minDateTeen = (moment().subtract(15, 'years')).toDate()
    const minDatePremarried = (moment().subtract(18, 'years')).toDate()

    const users = await User.aggregate(
        [
            { $match: {} },
            {
                $project: {
                    male: { $cond: [{ $eq: ["$sex", "male"] }, 1, 0] },
                    female: { $cond: [{ $eq: ["$sex", "female"] }, 1, 0] },
                    generus: { $cond: [{ $eq: ["$role", "GENERUS"] }, 1, 0] },
                    pengajar: { $cond: [{ $eq: ["$role", "TEACHER"] }, 1, 0] },
                    preteenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDatePreteen] }, { $gt : ["$birthdate", minDateTeen] }] }, 1, 0] },
                    teenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDateTeen] }, { $gt : ["$birthdate", minDatePremarried] }] }, 1, 0] },
                    premarriedAge: { $cond: [{ $lte: ["$birthdate", minDatePremarried] }, 1, 0] }
                }
            },
            {
                $group: {
                    _id: null, 
                    total: { $sum: 1 },
                    male: { $sum: "$male" },
                    female: { $sum: "$female" },
                    generus: { $sum: "$generus" },
                    pengajar: { $sum: "$pengajar" },
                    preteenAge: { $sum: "$preteenAge" },
                    teenAge: { $sum: "$teenAge" },
                    premarriedAge: { $sum: "$premarriedAge" },
                }
            }
        ]
    )

    const scores = await Completion.aggregate(
        [
            { $match: {} },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$poin" }
                }
            },
        ]
    )

    res.status(200).json({
        users,
        scores,
    })
})

export {
    getDashboard
}