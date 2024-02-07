const router = require('express').Router()
const validate = require('../middlewares/validate')
const postController = require('../controllers/post')
const postValidation = require('../validations/post')
const { authChecker } = require('../middlewares/auth')



module.exports = router
