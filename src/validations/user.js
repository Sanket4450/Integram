const joi = require('joi')

const {
    stringValidation,
    dateValidation,
    numberValidation,
    stringReqValidation,
    booleanReqValidation,
    dateReqValidation,
    numberReqValidation
} = require('./common')

const postProfile = {
    body: joi.object().keys({
        fullName: stringReqValidation.max(30),
        nickName: stringReqValidation.max(15),
        profileImage: stringReqValidation,
        dateOfBirth: dateReqValidation,
        mobile: numberReqValidation.min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit',
            'number.max': 'Mobile number should be 10 digit'
        }),
        country: stringReqValidation,
        occupation: stringReqValidation
    })
}

const updateProfile = {
    body: joi.object().keys({
        email: stringValidation.email().lowercase(),
        fullName: stringValidation.max(30),
        nickName: stringValidation.max(15),
        profileImage: stringValidation,
        dateOfBirth: dateValidation,
        mobile: numberValidation.min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit',
            'number.max': 'Mobile number should be 10 digit'
        }),
        country: stringValidation,
        occupation: stringValidation
    })
}

const toggleNotifications = {
    body: joi.object().keys({
        isEnabled: booleanReqValidation
    })
}

module.exports = {
    postProfile,
    updateProfile,
    toggleNotifications,
}
