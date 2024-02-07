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

module.exports = {
    getPosts,
    addPost,
    toogleLike,
}
