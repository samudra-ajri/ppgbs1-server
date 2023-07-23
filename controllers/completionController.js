import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import subjectCategories from '../consts/subjectCategories.js'
import Completion from '../models/completionModel.js'
import Subject from '../models/subjectModel.js'
import filterManager from '../utils/filterManager.js'
import eventTypes from '../consts/eventTypes.js'
import throwError from '../utils/errorUtils.js'
import loggerUtils from '../utils/logger.js'
import loggerStatus from '../consts/loggerStatus.js'

// @desc    Create user completion
// @route   POST /api/completions
// @access  Private
const createCompletion = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.create
    req.event = eventLogger.event

    const { subjectId, completed } = req.body
    const exists = await Completion.findOne({ $and: [{ user: req.user.id }, { subject: subjectId }] })
    const subject = await Subject.findById(subjectId)

    const completionData = {
        user: req.user.id,
        ds: req.user.ds,
        klp: req.user.klp,
        birthdate: req.user.birthdate,
        role: req.user.role,
        sex: req.user.sex,
        subject: subjectId,
        completed: createCompletedTargets(subject, completed),
        category: subject.category,
        subjectName: subject.name
    }

    let completion = {}
    if (exists) {
        exists.user = completionData.user
        exists.ds = completionData.ds
        exists.klp = completionData.klp
        exists.birthdate = completionData.birthdate
        exists.role = completionData.role
        exists.sex = completionData.sex
        exists.subject = completionData.subject
        exists.completed = completionData.completed
        exists.category = completionData.category
        exists.subjectName = completionData.subjectName
        completion = await exists.save()
    } else {
        completion = await Completion.create(completionData)
    }

    if (completion) {
        res.status(201).json(completion._doc)
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.invalid, 400)
    }
})

// @desc    Get all completions by admin
// @route   GET /api/completions/admin
// @access  Private/Managers
const getCompletionsByAdmin = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listAdmin
    req.event = eventLogger.event

    const completions = await Completion.find({ ...filterManager(req.user) })
        .populate({ path: 'subject', model: 'Subject', select: 'name' })
        .populate({ path: 'user', model: 'User', select: 'name' })
    res.status(200).json({ total: completions.length, completions })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get the user completions by admin
// @route   GET /api/completions/user/:userId
// @access  Private/Managers
const getUserCompletionByAdmin = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listUserBased
    req.event = eventLogger.event

    const completions = await Completion.find({ user: req.params.userId })
        .populate({ path: 'subject', model: 'Subject', select: 'name' })
        .populate({ path: 'user', model: 'User', select: 'name' })
    if (completions) {
        res.status(200).json({ total: completions.length, completions })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Get a user completion by admin
// @route   POST /api/completion/:id/admin
// @access  Private/Managers
const getCompletionByAdmin = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.detailAdmin
    req.event = eventLogger.event

    const completion = await Completion.findById(req.params.id)
        .populate({ path: 'subject', model: 'Subject', select: 'name' })
        .populate({ path: 'user', model: 'User', select: 'name' })
    if (completion) {
        res.status(200).json(completion)
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Get user completions
// @route   GET /api/completions
// @access  Private
const getCompletions = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listUser
    req.event = eventLogger.event

    const completions = await Completion.find({ user: req.user.id })
    res.status(200).json({
        total: completions.length,
        totalPoin: generateTotalPoin(completions),
        completions
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get user completions by category
// @route   GET /api/completions/categories/:category
// @access  Private
const getCompletionsByCategory = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listByCategory
    req.event = eventLogger.event

    const completions = await Completion.find({
        $and: [{
            user: req.user.id
        }, {
            category: req.params.category.toUpperCase()
        }]
    })
    res.status(200).json({
        total: completions.length,
        totalPoin: generateTotalPoin(completions),
        completions
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get user completions by category and user id
// @route   GET /api/completions/categories/:category/users/:userId
// @access  Private
const getUserCompletionsByCategory = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listUserBasedByCategory
    req.event = eventLogger.event

    const completions = await Completion.find({
        $and: [{
            user: req.params.userId
        }, {
            category: req.params.category.toUpperCase()
        }]
    })
    res.status(200).json({
        total: completions.length,
        totalPoin: generateTotalPoin(completions),
        completions
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get user completions score
// @route   GET /api/completions/scores
// @access  Private
const getCompletionsScores = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listScore
    req.event = eventLogger.event

    const completions = await Completion.find({ user: req.user.id })
    res.status(200).json({
        totalPoin: generateTotalPoin(completions),
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get user completions score by user id
// @route   GET /api/completions/:userId/scores
// @access  Private, Managers
const getCompletionsScoresByUserId = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listScoreByUserId
    req.event = eventLogger.event

    const completions = await Completion.find({ user: req.params.userId })
    res.status(200).json({
        totalPoin: generateTotalPoin(completions),
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get all users completions score
// @route   GET /api/completions/scores/all?ds=&klp=&field=&category=
// @access  Private, Managers
const getAllCompletionsScores = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listScoreAll
    req.event = eventLogger.event

    const { ds, klp, field, category } = req.query;
    const type = field ? `$${field}` : '$category'
    const filters = [{ ds: { $ne: "MOVING" } }]
    let match = {}
    if (ds) filters.push({ ds: ds.toUpperCase() })
    if (klp) filters.push({ klp: klp.toUpperCase() })
    if (category) filters.push({ category: category.toUpperCase() })
    if (filters.length !== 0) match = { $and: filters }

    const scores = await Completion.aggregate(
        [
            { $match: match },
            {
                $group: {
                    _id: type,
                    total: { $sum: "$poin" }
                }
            },
        ]
    )
    res.status(200).json({
        totalPoin: scores,
    })
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get all users completions score
// @route   GET /api/completions/scores/details/subjects/:subjectId?ds=&klp=
// @access  Private, Managers
const getAllCompletionsSubjectDetailsScores = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.listSubjectDetailsScores
    req.event = eventLogger.event

    const subjectId = mongoose.Types.ObjectId(req.params.subjectId);
    const { ds, klp } = req.query;
    const filters = [{ subject: subjectId }]
    if (ds) filters.push({ ds: ds.toUpperCase() })
    if (klp) filters.push({ klp: klp.toUpperCase() })

    const targetsCompleted = await Completion.aggregate(
        [
            { $match: { $and: filters } },
            { $unwind: "$completed" },
            { $group: { "_id": "$completed", "count": { $sum: 1 } } },
            { $sort: { _id: 1 } },
            {
                $group: {
                    "_id": null, "targetsCompleted": {
                        $push: {
                            "target": "$_id",
                            "count": "$count"
                        }
                    }
                }
            },
            { $project: { "_id": 0, "targetsCompleted": 1 } }
        ]
    )
    res.status(200).json(...targetsCompleted)
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get a user completion
// @route   GET /api/completion/:id
// @access  Private
const getCompletion = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.detail
    req.event = eventLogger.event

    const completion = await Completion.findOne({ $and: [{ user: req.user.id }, { id: req.params.id }] })
    if (completion) {
        res.status(200).json(completion)
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Get user completion by subjectId
// @route   GET /api/completion/subjects/:subjectId
// @access  Private
const getCompletionBySubjectId = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.detailBySubject
    req.event = eventLogger.event

    const completion = await Completion.findOne({ $and: [{ user: req.user.id }, { subject: req.params.subjectId }] })
    res.status(200).json(completion)
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Get user completion by subjectId and userId
// @route   GET /api/completion/subjects/:subjectId/users/:userId
// @access  Private
const getUserCompletionBySubjectId = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.detailBySubjectUserBased
    req.event = eventLogger.event

    const completion = await Completion.findOne({ $and: [{ user: req.params.userId }, { subject: req.params.subjectId }] })
    res.status(200).json(completion)
    loggerUtils({ req, status: loggerStatus.SUCCESS })
})

// @desc    Update completion
// @route   PUT /api/completions/:id
// @access  Private
const updateCompletion = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.update
    req.event = eventLogger.event

    const completion = await Completion.findOne({ $and: [{ user: req.user.id }, { id: req.params.id }] })
    if (completion) {
        completion.completed = req.body.completed || completion.completed
        await completion.save()
        res.status(200).json(completion)
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    Delete a completion
// @route   DELETE /api/completions/:id
// @access  Private
const deleteCompletion = asyncHandler(async (req, res) => {
    const eventLogger = eventTypes.completion.delete
    req.event = eventLogger.event

    const completion = await Completion.findOne({ $and: [{ user: req.user.id }, { id: req.params.id }] })
    if (completion) {
        await completion.remove()
        res.status(200).json({ id: req.params.id })
        loggerUtils({ req, status: loggerStatus.SUCCESS })
    } else {
        throwError(eventLogger.message.failed.notFound, 404)
    }
})

// @desc    create completed targets
const createCompletedTargets = (subject, completedInput) => {
    let completed = []
    completedInput.forEach(input => {
        if (subject.targets.includes(input)) {
            completed.push(input)
        }
    })
    return completed
}

// @desc    generate total poins
const generateTotalPoin = (completions) => {
    let total = {
        alquran: 0,
        hadits: 0,
        rote: 0,
        extra: 0,
        total: 0
    }

    completions.forEach(completion => {
        switch (completion.category) {
            case subjectCategories.ALQURAN:
                total.alquran += completion.poin
                break;

            case subjectCategories.HADITS:
                total.hadits += completion.poin
                break;

            case subjectCategories.ROTE:
                total.rote += completion.poin
                break;

            case subjectCategories.EXTRA:
                total.extra += completion.poin
                break;
        }
    })
    total.total = total.alquran + total.hadits + total.rote + total.extra
    return total
}

export {
    createCompletion,
    getCompletions,
    getCompletion,
    deleteCompletion,
    getCompletionsByAdmin,
    getCompletionByAdmin,
    getUserCompletionByAdmin,
    updateCompletion,
    getCompletionsByCategory,
    getCompletionsScores,
    getCompletionsScoresByUserId,
    getCompletionBySubjectId,
    getUserCompletionsByCategory,
    getUserCompletionBySubjectId,
    getAllCompletionsScores,
    getAllCompletionsSubjectDetailsScores
}