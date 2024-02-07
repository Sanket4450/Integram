const router = require('express').Router()
const validate = require('../middlewares/validate')
const postController = require('../controllers/post')
const postValidation = require('../validations/post')
const { authChecker } = require('../middlewares/auth')

router.get(
    '/',
    authChecker,
    validate(postValidation.getPosts),
    postController.getPosts
)

router.post(
    '/',
    authChecker,
    validate(postValidation.addPost),
    postController.addPost
)

router.post(
    '/toggle-like',
    authChecker,
    validate(postValidation.toogleLike),
    postController.toogleLike
)

router.post(
    '/comment',
    authChecker,
    validate(postValidation.addComment),
    postController.addComment
)

router.delete(
    '/comment',
    authChecker,
    validate(postValidation.deleteComment),
    postController.deleteComment
)

router.post(
    '/comment/reply',
    authChecker,
    validate(postValidation.replyComment),
    postController.replyComment
)

module.exports = router
