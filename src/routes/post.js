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
    validate(postValidation.toogleLike),
    postController.toogleLike
)

module.exports = router
