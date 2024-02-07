const router = require('express').Router()
const authRoutes = require('./auth')
const userRoutes = require('./user')
const postRoutes = require('./post')
const commentRoutes = require('./comment')

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)

module.exports = router
