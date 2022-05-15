import mongoose from 'mongoose'

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    this.totalPoin = this.targets.length
})

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject