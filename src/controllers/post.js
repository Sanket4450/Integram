const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const { userService, postService, commentService } = require('../services')

exports.getPosts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    // const posts = await postService.getPosts({ page, limit })

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

exports.toogleLike = catchAsyncErrors(async (req, res) => {
    const body = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await postService.getPostById(body.postId))) {
        throw new ApiError(
            constant.MESSAGES.POST_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const { isLiked } = await postService.toggleLike(user._id, body)

    return sendResponse(
        res,
        httpStatus.OK,
        { isLiked },
        `Post ${isLiked ? 'liked' : 'disliked'} successfully`
    )
})

exports.addComment = catchAsyncErrors(async (req, res) => {
    const body = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await postService.getPostById(body.postId))) {
        throw new ApiError(
            constant.MESSAGES.POST_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const { text } = await commentService.addComment(user._id, body)

    const comment = { text }

    return sendResponse(
        res,
        httpStatus.OK,
        { comment },
        'Comment posted successfully'
    )
})
