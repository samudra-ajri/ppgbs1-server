import asyncHandler from 'express-async-handler'
import Completion from '../models/completionModel.js'

// @desc    Create user completion
// @route   POST /api/completions
// @access  private
const createCompletion = asyncHandler(async (req, res) => {
    const { subject, completed } = req.body
    const exists = await Completion.findOne({ $and:[{ user: req.user.id }, { subject }] })
    if (exists) {
        res.status(404)
        throw new Error('Subject already added')
    }

    const conpletion = await Completion.create({ user: req.user.id, subject, completed})
    if (conpletion) {
        res.status(201).json(conpletion._doc)
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

export { 
    createCompletion,
}