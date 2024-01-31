const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const User = require('../models/user')

exports.getUserById = async (userId) => {

    const query = {
        _id: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getUserByEmail = async (email) => {
    const query = {
        email
    }

    const data = {
        password: 1,
        isProfileCompleted: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getUserByMobile = async (mobile) => {
    const query = {
        mobile
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getFullUserById = async (userId, userData) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId)
    }

    const data = (typeof userData === 'object' && Object.keys(userData).length >= 1)
        ? { ...userData }
        : {
            fullName: 1,
            nickName: 1,
            profileImage: 1,
            dateOfBirth: 1,
            email: 1,
            mobile: 1,
            country: 1,
            occupation: 1
        }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getFullUserExcludingId = async (userId, userData) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId)
    }

    const data = (typeof userData === 'object' && Object.keys(userData).length >= 1)
        ? { ...userData }
        : {
            fullName: 1,
            nickName: 1,
            profileImage: 1,
            dateOfBirth: 1,
            email: 1,
            mobile: 1,
            country: 1,
            occupation: 1,
            _id: 0
        }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.createUser = async (userBody) => {
    try {
        console.info('Inside createUser')

        userBody.password = await bcrypt.hash(userBody.password, 10)

        return dbRepo.create(constant.COLLECTIONS.USER, { data: userBody })
    } catch (error) {
        console.error(`createUser error => ${error}`)

        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.updatePassword = async (userId, password) => {
    try {
        console.info('Inside updatePassword')

        const query = {
            _id: new mongoose.Types.ObjectId(userId)
        }
        const data = {
            password: await bcrypt.hash(password, 10)
        }

        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
    } catch (error) {
        console.error(`updatePassword error => ${error}`)

        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.updateUser = async (userId, userBody) => {
    try {
        console.info('Inside updateUser')

        const query = {
            _id: new mongoose.Types.ObjectId(userId)
        }

        if (userBody.email || userBody.mobile) {
            const emailOrMobileTaken = await User.findOne({
                $or: [
                    { $and: [{ email: userBody.email }, { _id: { $ne: new mongoose.Types.ObjectId(userId) } }] },
                    { $and: [{ mobile: userBody.mobile }, { _id: { $ne: new mongoose.Types.ObjectId(userId) } }] }
                ]
            })

            if (emailOrMobileTaken) {
                throw new ApiError(constant.MESSAGES.USER_ALREADY_EXISTS, httpStatus.CONFLICT)
            }

            // send a verification link to email & mobile
        }

        const data = {
            $set: {
                ...userBody
            }
        }

        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
    } catch (error) {
        console.error(`updateUser error => ${error}`)

        if (error.message === constant.MESSAGES.USER_ALREADY_EXISTS) {
            throw new ApiError(constant.MESSAGES.USER_ALREADY_EXISTS, httpStatus.CONFLICT)
        }
        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.deleteUserById = async (userId) => {
    console.info('Inside deleteUserById')

    const query = {
        _id: new mongoose.Types.ObjectId(userId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.USER, { query })
}
