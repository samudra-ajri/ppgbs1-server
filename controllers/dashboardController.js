import asyncHandler from 'express-async-handler'
import moment from 'moment'
import roleTypes from '../consts/roleTypes.js'
import Completion from '../models/completionModel.js'
import User from '../models/userModel.js'
import eventTypes from '../consts/eventTypes.js'
import loggerUtils from '../utils/logger.js'
import loggerStatus from '../consts/loggerStatus.js'

// @desc    Get dashboard
// @route   GET /api/dashboard
// @access  Private, Managers
const getDashboard = asyncHandler(async (req, res) => {
	const eventLogger = eventTypes.dashboard.detail
    req.event = eventLogger.event

	let match = { ds: { $ne: "MOVING" } }
	const minDatePreteen = (moment().subtract(12, 'years')).toDate()
	const minDateTeen = (moment().subtract(15, 'years')).toDate()
	const minDatePremarried = (moment().subtract(18, 'years')).toDate()
	const maxnDatePremarried = (moment().subtract(30, 'years')).toDate()

	if (Object.keys(req.query).length !== 0) {
		if (req.query.role === "MUBALLIGH") req.query.role = {$in: [roleTypes.MS, roleTypes.MT]
		}
		if (!req.query.age) {
			match = { $and: [req.query, { ds: { $ne: "MOVING" } }] }
		} else {
			const filters = [{ ds: { $ne: "MOVING" } }]
			switch (req.query.age) {
				case 'preteenAge':
					filters.push({ birthdate: { $lte: minDatePreteen, $gt: minDateTeen } })
					break;
				case 'teenAge':
					filters.push({ birthdate: { $lte: minDateTeen, $gt: minDatePremarried } })
					break;
				case 'premarriedAge':
					filters.push({ birthdate: { $lte: minDatePremarried, $gte: maxnDatePremarried } })
					break;
			}
			delete req.query.age
			filters.push(req.query)
			match = { $and: filters }
		}
	}

	const users = await User.aggregate(
		[
			{ $match: match },
			{
				$project: {
					male: { $cond: [{ $eq: ["$sex", "male"] }, 1, 0] },
					female: { $cond: [{ $eq: ["$sex", "female"] }, 1, 0] },
					generus: { $cond: [{ $eq: ["$role", "GENERUS"] }, 1, 0] },
					// generus: { $cond: [{ $and: [{ $eq: ["$role", "GENERUS"] }, { $ne: ["$ds", "MOVING"] }] }, 1, 0] },
					mt: { $cond: [{ $eq: ["$role", "MT"] }, 1, 0] },
					ms: { $cond: [{ $eq: ["$role", "MS"] }, 1, 0] },
					preteenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDatePreteen] }, { $gt: ["$birthdate", minDateTeen] }] }, 1, 0] },
					teenAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDateTeen] }, { $gt: ["$birthdate", minDatePremarried] }] }, 1, 0] },
					premarriedAge: { $cond: [{ $and: [{ $lte: ["$birthdate", minDatePremarried] }, { $gte: ["$birthdate", maxnDatePremarried] }] }, 1, 0] }
				}
			},
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					generus: { $sum: "$generus" },
					mt: { $sum: "$mt" },
					ms: { $sum: "$ms" },
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
	loggerUtils({ req, status: loggerStatus.SUCCESS })
})

export {
	getDashboard
}