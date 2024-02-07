const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const User = require('../models/user')

exports.getPostById = async (postId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(postId),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.POST, { query, data })
}

exports.getPosts = async ({ page, limit }) => {
    console.info(`Inside getPosts => page = ${page}, limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        },
        {
            $lookup: {
                from: 'users',
                localField: 'creator',
                foreignField: '_id',
                as: 'creator',
            },
        },
        {
            $unwind: {
                path: '$creator',
            },
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'postId',
                as: 'comments',
            },
        },
        {
            $addFields: {
                likesCount: { $size: '$likedBy' },
                commentsCount: { $size: '$comments' },
            },
        },
        {
            $project: {
                caption: 1,
                imgURL: 1,
                creator: {
                    profileImage: 1,
                    fullName: 1,
                },
                createdAt: 1,
                likesCount: 1,
                commentsCount: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.POST, pipeline)
}

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

const likePost = async (postId, userId) => {
    try {
        console.info('Inside likePost')

        const query = {
            _id: new mongoose.Types.ObjectId(postId),
            likedBy: { $ne: new mongoose.Types.ObjectId(userId) },
        }

        const data = {
            $push: {
                likedBy: new mongoose.Types.ObjectId(userId),
            },
        }

        return dbRepo.updateOne(constant.COLLECTIONS.POST, { query, data })
    } catch (error) {
        console.error(`likePost error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

const unlikePost = async (postId, userId) => {
    try {
        console.info('Inside unlikePost')

        const query = {
            _id: new mongoose.Types.ObjectId(postId),
            likedBy: { $eq: new mongoose.Types.ObjectId(userId) },
        }

        const data = {
            $pull: {
                likedBy: new mongoose.Types.ObjectId(userId),
            },
        }

        return dbRepo.updateOne(constant.COLLECTIONS.POST, { query, data })
    } catch (error) {
        console.error(`unlikePost error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

exports.toggleLike = async (userId, postBody) => {
    try {
        console.info('Inside toggleLike')

        postBody.isLiked
            ? await likePost(postBody.postId, userId)
            : await unlikePost(postBody.postId, userId)

        return { isLiked: postBody.isLiked }
    } catch (error) {
        console.error(`toggleLike error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}