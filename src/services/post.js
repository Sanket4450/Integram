const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const User = require('../models/user')

exports.addPost = async (userId, postBody) => {
    try {
        console.info('Inside addPost')

        const data = {
            creator: new mongoose.Types.ObjectId(userId),
            caption: postBody.caption,
            imgURL: postBody.imgURL,
        }

        return dbRepo.create(constant.COLLECTIONS.POST, { data })
    } catch (error) {
        console.error(`addPost error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}
