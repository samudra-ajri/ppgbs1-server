import mongoose from 'mongoose'

const schema = mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    attenders: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        ds: {
            type: String,
            required: true
        },
        klp: {
            type: String,
            required: true
        },
        sex: {
            type: String,
            required: true
        },
        time: {
            type: Date
        }
    }]
}, {
    timestamps: true
})

const Presence = mongoose.model('Presence', schema)

export default Presence