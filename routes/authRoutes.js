const express = require('express')
const config = require('../config')
const authController = require(`../modules/${config.APP_VERSION}/auth/authController`)

const router = express.Router()
router.route('/login').post(authController.login)

module.exports = router