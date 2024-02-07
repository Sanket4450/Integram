const router = require('express').Router()
const authRoutes = require('./auth')
const userRoutes = require('./user')
const postRoutes = require('./post')

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)

module.exports = router
