import mongoose from 'mongoose'
import classTypes from '../consts/classTypes.js'

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    passCode: {
        type: String,
        required: true
    },
    classType: {
        type: String,
        require: true,
        enum: Object.values(classTypes),
    },
    ds: {
        type: String
    },
    klp: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

const Event = mongoose.model('Event', eventSchema)

export default Event