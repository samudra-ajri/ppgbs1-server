import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import roleTypes from '../consts/roleTypes.js'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true

    },
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    isMuballigh: {
        type: Boolean,
        required: false,
        default: false
    },
    ds: {
        type: String,
        required: true
    },
    klp: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: roleTypes.GENERUS
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User