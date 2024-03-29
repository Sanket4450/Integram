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

    let posts = await postService.getPosts({ page, limit })

    posts = await postService.validateLikedPosts(user._id, posts)

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
        postId: _id,
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

exports.getComments = catchAsyncErrors(async (req, res) => {
    const { postId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await postService.getPostById(postId))) {
        throw new ApiError(
            constant.MESSAGES.POST_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const rawComments = await commentService.getComments(postId)

    const comments = rawComments.map((comment) => ({
        commentId: comment._id,
        text: comment.text,
    }))

    return sendResponse(
        res,
        httpStatus.OK,
        { comments },
        'Comments fetched successfully'
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

    const { _id, text } = await commentService.addComment(user._id, body)

    const comment = { commentId: _id, text }

    return sendResponse(
        res,
        httpStatus.OK,
        { comment },
        'Comment posted successfully'
    )
})

exports.deleteComment = catchAsyncErrors(async (req, res) => {
    const { commentId } = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await commentService.getCommentById(commentId))) {
        throw new ApiError(
            constant.MESSAGES.COMMENT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await commentService.getUserCommentById(commentId, user._id))) {
        throw new ApiError(
            constant.MESSAGES.NOT_ALLOWED,
            httpStatus.FORBIDDEN
        )
    }

    await commentService.deleteComment(commentId, user._id)

    return sendResponse(res, httpStatus.OK, {}, 'Comment deleted successfully')
})

exports.replyComment = catchAsyncErrors(async (req, res) => {
    const body = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await commentService.getCommentById(body.commentId))) {
        throw new ApiError(
            constant.MESSAGES.COMMENT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const { _id, text } = await commentService.replyComment(user._id, body)

    const comment = { commentId: _id, text }

    return sendResponse(
        res,
        httpStatus.OK,
        { comment },
        'Comment posted successfully'
    )
})
