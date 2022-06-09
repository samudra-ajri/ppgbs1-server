import mongoose from 'mongoose'
import subjectCategories from '../consts/subjectCategories.js'

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        require: true,
        enum: Object.values(subjectCategories),
    },
    targets: {
        type: [String],
        required: true
    },
    totalPoin: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

subjectSchema.pre('save', async function(next) {
    this.name = this.name.toUpperCase()
    this.targets = this.targets.map(target => { return target.toUpperCase() })
    this.totalPoin = this.targets.length
})

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject