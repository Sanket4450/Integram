const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const {
    userService
} = require('../services')

exports.postProfile = catchAsyncErrors(async (req, res) => {
    const body = req.body

    let user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_EXIST, httpStatus.NOT_FOUND)
    }

    await userService.updateUser(user._id, { ...body, isProfileCompleted: true })

    // const notificationBody = {
    //     title: 'Account Setup Successfull!',
    //     message: 'Your account has been created!',
    //     icon: 'icon1.svg'
    // }

    // await notificationService.createNotification(user._id, notificationBody)

    user = await userService.getFullUserExcludingId(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile created successfully'
    )
})

exports.getProfile = catchAsyncErrors(async (req, res) => {
    const user = await userService.getFullUserExcludingId(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile retrieved successfully'
    )
})

exports.updateProfile = catchAsyncErrors(async (req, res) => {
    const body = req.body

    let user = await userService.getFullUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.updateUser(user._id, body)

    user = await userService.getFullUserExcludingId(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile updated successfully'
    )
})

exports.deleteProfile = catchAsyncErrors(async (req, res) => {
    const user = await userService.getFullUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.deleteUserById(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Profile deleted successfully'
    )
})

exports.toggleNotifications = catchAsyncErrors(async (req, res) => {
    const { isEnabled } = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.updateUser(user._id, { isNotificationEnabled: isEnabled })

    return sendResponse(
        res,
        httpStatus.OK,
        { isEnabled },
        `Notifications ${isEnabled ? 'enabled' : 'disabled'} successfully`
    )
})
