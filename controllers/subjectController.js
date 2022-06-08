import asyncHandler from 'express-async-handler'
import Subject from '../models/subjectModel.js'

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
    const { name, totalPages, targets } = req.body
    const exists = await Subject.findOne({ name })
    if (exists) {
        res.status(404)
        throw new Error('Subject already added')
    }

    const generatedTargets = generateTargets(totalPages, targets)
    const subject = await Subject.create({ name, targets: generatedTargets })
    if (subject) {
        res.status(201).json(subject._doc)
    } else {
        res.status(400)
        throw new Error('Invalid data')
    }
})

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({})
    res.status(200).json({ 
        total: subjects.length, 
        totalPoin: generateTotalPoin(subjects),  
        subjects })
})

// @desc    Get subject by id
// @route   GET /api/subjects/:id
// @access  Public
const getSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id)
    if (subject) {
        res.status(200).json(subject)
    } else {
        res.status(400)
        throw new Error('Subject not found')
    }
})

// @desc    Ubdate a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id)
    if (subject) {
        subject.name = req.body.name || subject.name
        subject.targets = generateTargets(
            req.body.totalPages, 
            req.body.targets, 
            req.body.newTargets,
            subject
        ) || subject.targets
        
        const updatedSubject = await subject.save()
        res.status(200).json(updatedSubject)
    } else {
        res.status(400)
        throw new Error('Subject not found')
    }
})

// @desc    Delete a subject
// @route   Delete /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id)
    if (subject) {
        await subject.remove()
        res.status(200).json({ id: req.params.id })
    } else {
        res.status(400)
        throw new Error('Subject not found')
    }
})

// @desc    Generate subject targets
const generateTargets = (totalPages, targets, newTargets, subject) => {
    if (totalPages) {
        // if quran ra hadits targets
        return Array.from(Array(totalPages)).map((_, i) => i + 1)
    } else if (targets) {
        // if extra or rote targets
        return targets
    } else if (newTargets) {
        // if update extra or rote targets
        return generateUpdatedTargets(newTargets, subject)
    } else {
        return null
    }
}

// @desc    Generate updated subjet targets
const generateUpdatedTargets = (newTargets, subject) => {
    if (!subject.targets.includes(newTargets)) {
        return [...subject.targets, newTargets]
    } else {
        return null
    }
}

// @desc    generate total poins
const generateTotalPoin = (subjects) => {
    let total = 0
    subjects.forEach(subject => {
        total += subject.totalPoin
    })
    return total
}

export { 
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubject
}