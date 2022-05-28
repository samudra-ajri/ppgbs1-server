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

locationSchema.pre('save', async function(next) {
    this.ds = this.ds.toUpperCase()
    this.klp = this.klp.map(member => { return member.toUpperCase() })
})

const Location = mongoose.model('Location', locationSchema)

export default Location