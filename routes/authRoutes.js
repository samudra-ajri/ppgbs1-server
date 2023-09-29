const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const authController = require(`../modules/${config.APP_VERSION}/auth/authController`)

const router = express.Router()
router.route('/register').post(authController.register)
router.route('/login').post(authController.login)
router.route('/me').get(protect, authController.me)
router.route('/forgot-password').put(authController.forgotPassword)
router.route('/reset-password').put(protect, admin, authController.resetPassword)

module.exports = router