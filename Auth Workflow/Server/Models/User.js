const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
        maxLength: 50
    },

    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 6
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    verificationToken: {
        type: String
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verified: {
        type: Date
    },

    passwordToken: {
        type: String
    },

    passwordTokenExpiration: {
        type: Date
    }

})


UserSchema.pre('save', async function () {

    if (!this.isModified('password')) return

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})


UserSchema.methods.comparePassword = async function (canditatePassword) {

    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch

}


module.exports = mongoose.model('User', UserSchema)