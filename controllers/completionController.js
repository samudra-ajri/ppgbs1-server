import asyncHandler from 'express-async-handler'
import Completion from '../models/completionModel.js'
import Subject from '../models/subjectModel.js'

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
        subject: subjectId, 
        completed: createCompletedTargets(subject, completed)
    })
    if (completion) {
        res.status(201).json(completion._doc)
    } else {
        res.status(400)
        throw new Error('Invalid data')
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

export { 
    createCompletion,
}