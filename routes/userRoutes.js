const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const userController = require(`../modules/${config.APP_VERSION}/user/userController`)

const router = express.Router()

router.route('/').get(protect, userController.list)
router.route('/:id').get(protect, userController.detail)
router.route('/me').put(protect, userController.updateMyProfile)
router.route('/me/student').get(protect, userController.updateMyStudentProfile)
router.route('/me/teacher').get(protect, userController.updateMyTeacherProfile)
router.route('/forgot-password').get(protect, admin, userController.forgotPasswordList)

module.exports = router