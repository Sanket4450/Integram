const joi = require('joi')

const {
    stringValidation,
    stringReqValidation,
    idReqValidation,
    booleanReqValidation,
    integerNumberValidation,
} = require('./common')

const getPosts = {
    query: joi.object().keys({
        page: integerNumberValidation.min(1),
        limit: integerNumberValidation.min(1),
    }),
}

const addPost = {
    body: joi.object().keys({
        caption: stringValidation.max(200).messages({
            'string.max': 'Caption text should not exceed 200 characters',
        }),
        imgURL: stringReqValidation,
    }),
}

const toogleLike = {
    body: joi.object().keys({
        postId: idReqValidation,
        isLiked: booleanReqValidation,
    }),
}

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
    getPosts,
    addPost,
    toogleLike,
    addComment,
    deleteComment,
    replyComment,
}
