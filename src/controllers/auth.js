const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const {
    authService,
    userService,
    tokenService
} = require('../services')

exports.register = catchAsyncErrors(async (req, res) => {
    const body = req.body

    await authService.checkUserWithEmail(body.email)

    if (body.role === 'admin' && body.secret !== process.env.ADMIN_SECRET) {
        throw new ApiError(constant.MESSAGES.INVALID_SECRET, httpStatus.FORBIDDEN)
    }

    const user = await userService.createUser(body)

    const { token } = (body.role && body.role === 'admin')
        ? await tokenService.generateAuthToken(user._id, 'admin')
        : await tokenService.generateAuthToken(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { token },
        'You have signed-up successfully'
    )
})

exports.login = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body

    const { _id, role, isProfileCompleted } = await authService.loginWithEmailAndPassword(email, password)

    const { token } = await tokenService.generateAuthToken(_id, role)

    return sendResponse(
        res,
        httpStatus.OK,
        { token, isProfileCompleted },
        'You have logged-in successfully'
    )
})

exports.forgotPasswordWithEmail = catchAsyncErrors(async (req, res) => {
    const resetToken = await authService.forgotPasswordWithEmail(req.body.email)

    // send an otp on the email (ex. 1234)

    return sendResponse(
        res,
        httpStatus.OK,
        { resetToken },
        'Forgot password successfully'
    )
})

exports.verifyResetOtp = catchAsyncErrors(async (req, res) => {
    const { token, otp } = req.body

    await authService.verifyResetOtp({ token, otp })

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'OTP verified successfully'
    )
})

exports.resetPassword = catchAsyncErrors(async (req, res) => {
    const { token, password } = req.body

    await authService.resetPassword({ token, password })

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Password updated successfully'
    )
})
