import mongoose from 'mongoose'

const locationSchema = mongoose.Schema({
    ds: {
        type: String,
        required: true
    },
    klp: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
})

const Location = mongoose.model('Location', locationSchema)

export default Location