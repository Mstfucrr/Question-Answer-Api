const express = require('express')
// /api
const router = express.Router()
const question = require('./question')
const auth = require('./auth')
const user = require('./user')
const admin = require('./admin')

router.get('/', (req, res) => {
    res.send('Welcome to the API')
})
router.use('/question',question)
router.use('/auth',auth)
router.use('/users',user)
router.use('/admin',admin)


module.exports = router;