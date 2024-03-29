const router = require('express').Router()
const validate = require('../middlewares/validate')
const authValidation = require('../validations/auth')
const authController = require('../controllers/auth')

router.post(
    '/register',
    validate(authValidation.register),
    authController.register
)

router.post('/login', validate(authValidation.login), authController.login)

router.post(
    '/forgot-password/email',
    validate(authValidation.forgotPasswordWithEmail),
    authController.forgotPasswordWithEmail
)

router.post(
    '/verify-reset-otp',
    validate(authValidation.verifyResetOtp),
    authController.verifyResetOtp
)

router.put(
    '/reset-password',
    validate(authValidation.resetPassword),
    authController.resetPassword
)

module.exports = router
