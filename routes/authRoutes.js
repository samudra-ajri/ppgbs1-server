const express = require('express')
const config = require('../config')
const { protect, teacher } = require('../middlewares/authMiddleware')
const authController = require(`../modules/${config.APP_VERSION}/auth/authController`)

const router = express.Router()
router.route('/register').post(authController.register)
router.route('/register-by-admin').post(protect, teacher, authController.registerByAdmin)
router.route('/login').post(authController.login)
router.route('/me').get(protect, authController.me)
router.route('/forgot-password').post(authController.forgotPassword)
router.route('/switch-position').post(protect, authController.switchPosition)
router.route('/temp-password/:token').post(protect, teacher, authController.tempPassword)
router.route('/reset-password/:token').post(authController.resetPassword)
router.route('/update-password').put(protect, authController.updatePassword)
router.route('/hash-string').post(authController.hashString)

module.exports = router