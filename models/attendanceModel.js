import mongoose from 'mongoose'
import classTypes from '../consts/classTypes.js'

const schema = mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    classTypes: [{
        type: String,
        require: true,
        enum: Object.values(classTypes),
    }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ds: {
        type: String,
    },
    klp: {
        type: String,
    },
    sex: {
        type: String,
    },
    birthdate: {
        type: Date,
        required: true
    },
    time: {
        type: Date
    }
}, {
    timestamps: true
})

const Attendance = mongoose.model('Attendance', schema)
export default Attendance