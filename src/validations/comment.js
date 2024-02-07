const joi = require('joi')

const { stringReqValidation, idReqValidation } = require('./common')

const addComment = {
    body: joi.object().keys({
        postId: idReqValidation,
        text: stringReqValidation.max(100).messages({
            'string.max': 'Comment text should not exceed 100 characters',
        }),
    }),
}

const deleteComment = {
    body: joi.object().keys({
        commentId: idReqValidation,
    }),
}

const replyComment = {
    body: joi.object().keys({
        commentId: idReqValidation,
        text: stringReqValidation.max(100).messages({
            'string.max': 'Comment text should not exceed 100 characters',
        }),
    }),
}

module.exports = {
    addComment,
    deleteComment,
    replyComment,
}
