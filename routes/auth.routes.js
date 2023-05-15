const router = require('express').Router()
const controllers = require('../controllers/auth.controllers')

// routing USERS
// get data by id USERS
router.post('/auth/login', controllers.loginUsers)

module.exports = router
