const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const { userService, postService } = require('../services')

exports.getPosts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const posts = await postService.getPosts({ page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { posts },
        'Posts fetched successfully'
    )
})

exports.addPost = catchAsyncErrors(async (req, res) => {
    const body = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const { _id, caption, imgURL } = await postService.addPost(user._id, body)

    const post = {
        id: _id,
        caption,
        imgURL,
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { post },
        'Post created successfully'
    )
})
