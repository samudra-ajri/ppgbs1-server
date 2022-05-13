import mongoose from 'mongoose'

const quranSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    completed: {
        type: [String]
    },
    poin: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

quranSchema.pre('save', async function(next) {
    if (!this.isModified('completed')) next()
    this.poin = this.completed ?? this.completed.length
})

const Quran = mongoose.model('Quran', quranSchema)

export default Quran