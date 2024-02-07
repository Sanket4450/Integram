const mongoose = require('mongoose')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')

exports.getCommentById = async (commentId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(commentId),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.COMMENT, { query, data })
}

exports.getUserCommentById = async (commentId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(commentId),
        user: new mongoose.Types.ObjectId(userId),
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

const removeCommentFromReply = async (commentId) => {
    try {
        const query = {
            replies: { $eq: new mongoose.Types.ObjectId(commentId) },
        }

        const data = {
            $pull: { replies: new mongoose.Types.ObjectId(commentId) },
        }

        await dbRepo.updateOne(constant.COLLECTIONS.COMMENT, { query, data })
    } catch (error) {
        console.error(`deleteComment error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

const getReplyComments = async (commentId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(commentId),
    }

    const data = {
        replies: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.COMMENT, { query, data })
}

exports.deleteComment = async (commentId) => {
    try {
        console.info('Inside deleteComment')

        await removeCommentFromReply(commentId)

        const { replies } = await getReplyComments(commentId)

        if (replies.length) {
            for (let reply of replies) {
                await dbRepo.deleteMany(constant.COLLECTIONS.COMMENT, {
                    query: { _id: new mongoose.Types.ObjectId(reply) },
                })
            }
        }

        const query = {
            _id: new mongoose.Types.ObjectId(commentId),
        }

        await dbRepo.deleteOne(constant.COLLECTIONS.COMMENT, { query })
    } catch (error) {
        console.error(`deleteComment error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

const createReplyComment = async (userId, text) => {
    try {
        console.info('Inside addReplyComment')

        const data = {
            user: new mongoose.Types.ObjectId(userId),
            text,
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

const addReplyComment = async (commentId, replyId) => {
    try {
        console.info('Inside addReplyComment')

        const query = {
            _id: new mongoose.Types.ObjectId(commentId),
            replies: { $ne: new mongoose.Types.ObjectId(replyId) },
        }

        const data = {
            $push: {
                replies: new mongoose.Types.ObjectId(replyId),
            },
        }

        return dbRepo.updateOne(constant.COLLECTIONS.COMMENT, { query, data })
    } catch (error) {
        console.error(`addReplyComment error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

exports.replyComment = async (userId, { commentId, text }) => {
    try {
        console.info('Inside replyComment')

        const reply = await createReplyComment(userId, text)

        await addReplyComment(commentId, reply._id)

        return { text }
    } catch (error) {
        console.error(`replyComment error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}