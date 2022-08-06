import mongoose from 'mongoose'
import roleTypes from '../consts/roleTypes.js'

const completionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject',
    },
    completed: {
        type: [String]
    },
    poin: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    ds: {
        type: String,
        required: true
    },
    klp: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: roleTypes.GENERUS
    },
    sex: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

completionSchema.pre('save', async function(next) {
    this.poin = this.completed.length
})

const Completion = mongoose.model('Completion', completionSchema)

export default Completion