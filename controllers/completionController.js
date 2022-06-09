import asyncHandler from 'express-async-handler'
import Completion from '../models/completionModel.js'
import Subject from '../models/subjectModel.js'
import filterManager from '../utils/filterManager.js'

// @desc    Create user completion
// @route   POST /api/completions
// @access  Private
const createCompletion = asyncHandler(async (req, res) => {
    const { subjectId, completed } = req.body
    const exists = await Completion.findOne({ $and:[{ user: req.user.id }, { subject: subjectId }] })
    if (exists) {
        res.status(404)
        throw new Error('Subject already exists')
    }
    const subject = await Subject.findById(subjectId)
    const completion = await Completion.create({ 
        user: req.user.id,
        ds: req.user.ds,
        klp: req.user.klp,
        subject: subjectId, 
        completed: createCompletedTargets(subject, completed),
        category: subject.category
    })
    if (completion) {
        res.status(201).json(completion._doc)
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    Get all completions by admin
// @route   POST /api/completions/admin
// @access  Private/Managers
const getCompletionsByAdmin = asyncHandler(async (req, res) => {
    const completions = await Completion.find({ ...filterManager(req.user) })
        .populate({ path:'subject', model:'Subject', select:'name' })
        .populate({ path:'user', model:'User', select: 'name' })
    res.status(200).json({ total:completions.length, completions })
})

// @desc    Get the user completions by admin
// @route   POST /api/completions/user/:userId
// @access  Private/Managers
const getUserCompletionByAdmin = asyncHandler(async (req, res) => {
    const completions = await Completion.find({ user: req.params.userId })
        .populate({ path:'subject', model:'Subject', select:'name' })
        .populate({ path:'user', model:'User', select: 'name' })
    if (completions) {
        res.status(200).json({ total:completions.length, completions})
    } else {
        res.status(400)
        throw new Error('User completion not found')
    }
})

// @desc    Get a user completion by admin
// @route   POST /api/completion/:id/admin
// @access  Private/Managers
const getCompletionByAdmin = asyncHandler(async (req, res) => {
    const completion = await Completion.findById(req.params.id)
        .populate({ path:'subject', model:'Subject', select:'name' })
        .populate({ path:'user', model:'User', select: 'name' })
    if (completion) {
        res.status(200).json(completion)
    } else {
        res.status(400)
        throw new Error('User completion not found')
    }
})

// @desc    Get user completions
// @route   POST /api/completions
// @access  Private
const getCompletions = asyncHandler(async (req, res) => {
    const completions = await Completion.find({ user: req.user.id })
    res.status(200).json({ 
        total:completions.length, 
        totalPoin: generateTotalPoin(completions),
        completions 
    })
})

// @desc    Get a user completion
// @route   POST /api/completion/:id
// @access  Private
const getCompletion = asyncHandler(async (req, res) => {
    const completion = await Completion.findOne({ $and:[{ user: req.user.id }, { id: req.params.id }] })
        .populate({ path:'subject', model:'Subject', select:'name' })
    if (completion) {
        res.status(200).json(completion)
    } else {
        res.status(400)
        throw new Error('User completion not found')
    }
})

// @desc    Update completion
// @route   PUT /api/completions/:id
// @access  Private
const updateCompletion = asyncHandler(async (req, res) => {
    const completion = await Completion.findOne({ $and:[{ user: req.user.id }, { id: req.params.id }] })
    if (completion) {
        completion.completed = req.body.completed || completion.completed
        await completion.save()
        res.status(200).json(completion)
    } else {
        res.status(400)
        throw new Error('User completion not found')
    }
})

// @desc    Delete a completion
// @route   DELETE /api/completions/:id
// @access  Private
const deleteCompletion = asyncHandler(async (req, res) => {
    const completion = await Completion.findOne({ $and:[{ user: req.user.id }, { id: req.params.id }] })
    if (completion) {
        await completion.remove()
        res.status(200).json({ id: req.params.id })
    } else {
        res.status(400)
        throw new Error('User completion not found')
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
    let total = 0
    completions.forEach(completion => {
        total += completion.poin
    })
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
}