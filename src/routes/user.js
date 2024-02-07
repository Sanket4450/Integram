const router = require('express').Router()
const validate = require('../middlewares/validate')
const userValidation = require('../validations/user')
const userController = require('../controllers/user')
const { authChecker } = require('../middlewares/auth')

router.post(
    '/profile',
    authChecker,
    validate(userValidation.postProfile),
    userController.postProfile
)

router.get('/profile', authChecker, userController.getProfile)

router.put(
    '/profile',
    authChecker,
    validate(userValidation.updateProfile),
    userController.updateProfile
)

router.delete('/profile', authChecker, userController.deleteProfile)

module.exports = router
