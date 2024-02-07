const joi = require('joi')

const {
    stringValidation,
    numberValidation,
    stringReqValidation,
    numberReqValidation,
} = require('./common')

const postProfile = {
    body: joi.object().keys({
        fullName: stringReqValidation.max(30),
        nickName: stringReqValidation.max(15),
        profileImage: stringReqValidation,
        mobile: numberReqValidation
            .min(10 ** 9)
            .max(10 ** 10 - 1)
            .messages({
                'number.min': 'Mobile number should be 10 digit',
                'number.max': 'Mobile number should be 10 digit',
            }),
        gender: stringReqValidation.allow('male', 'female', 'other'),
        country: stringReqValidation,
        occupation: stringReqValidation,
    }),
}

const updateProfile = {
    body: joi.object().keys({
        email: stringValidation.email().lowercase(),
        fullName: stringValidation.max(30),
        nickName: stringValidation.max(15),
        profileImage: stringValidation,
        mobile: numberValidation
            .min(10 ** 9)
            .max(10 ** 10 - 1)
            .messages({
                'number.min': 'Mobile number should be 10 digit',
                'number.max': 'Mobile number should be 10 digit',
            }),
        gender: stringValidation.allow('male', 'female', 'other'),
        country: stringValidation,
        occupation: stringValidation,
    }),
}

module.exports = {
    postProfile,
    updateProfile,
}
