const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const userService = require('./user')

const generateToken = ({ payload, secret, options }) => {
    return jwt.sign(payload, secret, options)
}

const verifyDBToken = (token, secret) => {
    if (!token) {
        throw new ApiError(
            constant.MESSAGES.TOKEN_IS_REQUIRED,
            httpStatus.FORBIDDEN
        )
    }
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    reject(
                        new ApiError(
                            constant.MESSAGES.INVALID_TOKEN,
                            httpStatus.UNAUTHORIZED
                        )
                    )
                }
                if (err.name === 'TokenExpiredError') {
                    reject(
                        new ApiError(
                            constant.MESSAGES.TOKEN_EXPIRED,
                            httpStatus.NOT_ACCEPTABLE
                        )
                    )
                }
                reject(new ApiError(err.message, httpStatus.UNAUTHORIZED))
            } else {
                userService.getTokenByUserId(decoded.sub).then((user) => {
                    if (user && user.token !== token) {
                        reject(
                            new ApiError(
                                constant.MESSAGES.INVALID_TOKEN,
                                httpStatus.UNAUTHORIZED
                            )
                        )
                    }
                    resolve(decoded)
                })
            }
        })
    })
}

const verifyToken = (token, secret) => {
    if (!token) {
        throw new ApiError(
            constant.MESSAGES.TOKEN_IS_REQUIRED,
            httpStatus.FORBIDDEN
        )
    }
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    reject(
                        new ApiError(
                            constant.MESSAGES.INVALID_TOKEN,
                            httpStatus.UNAUTHORIZED
                        )
                    )
                }
                if (err.name === 'TokenExpiredError') {
                    reject(
                        new ApiError(
                            constant.MESSAGES.TOKEN_EXPIRED,
                            httpStatus.NOT_ACCEPTABLE
                        )
                    )
                }
                reject(new ApiError(err.message, httpStatus.UNAUTHORIZED))
            }
            resolve(decoded)
        })
    })
}

const generateAuthToken = async (userId, role = 'user') => {
    console.info(`Inside generateAuthToken => role = ${role}`)

    const payload = {
        sub: userId,
        role,
    }
    const token = generateToken({
        payload,
        secret: process.env.ACCESS_TOKEN_SECRET,
        options: {},
    })

    await userService.updateUser(userId, { token })

    return { token }
}

module.exports = {
    generateToken,
    verifyDBToken,
    verifyToken,
    generateAuthToken,
}
