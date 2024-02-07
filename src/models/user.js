const { Schema, model } = require('mongoose')

const userSchema = new Schema(
    {
        fullName: {
            type: String,
        },
        nickName: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
        },
        mobile: {
            type: Number,
            unique: true,
        },
        dateOfBirth: {
            type: Date,
        },
        country: {
            type: String,
        },
        occupation: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isNotificationEnabled: {
            type: Boolean,
            default: true,
        },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        autoIndex: false,
    }
)

module.exports = model('User', userSchema)
