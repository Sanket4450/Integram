const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const User = require('../models/user')

exports.getCommentById = async (commentId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(commentId),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.COMMENT, { query, data })
}

exports.addComment = async (userId, commentBody) => {
    try {
        console.info('Inside addComment')

        const data = {
            postId: new mongoose.Types.ObjectId(commentBody.postId),
            user: new mongoose.Types.ObjectId(userId),
            text: commentBody.text,
        }

        return dbRepo.create(constant.COLLECTIONS.COMMENT, { data })
    } catch (error) {
        console.error(`addComment error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}