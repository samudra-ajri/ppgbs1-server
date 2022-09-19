import mongoose from 'mongoose'
import classTypes from '../consts/classTypes.js'

const schema = mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    passCode: {
        type: String,
        required: true
    },
    classTypes: [{
        type: String,
        require: true,
        enum: Object.values(classTypes),
    }],
    attendersCount: {
        type: Number
    },
    attenders: [{
        user: {
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
        time: {
            type: Date
        }
    }]
}, {
    timestamps: true
})

schema.pre('save', async function(next) {
    this.attendersCount = this.attenders.length
})

const Presence = mongoose.model('Presence', schema)

export default Presence