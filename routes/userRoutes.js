const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const userController = require(`../modules/${config.APP_VERSION}/user/userController`)
const userPositionController = require(`../modules/${config.APP_VERSION}/userPosition/userPositionController`)

const router = express.Router()
// user
router.route('/').get(protect, userController.list)
router.route('/:id').get(protect, userController.detail)
router.route('/me').put(protect, userController.updateMyProfile)
router.route('/me/student').put(protect, userController.updateMyStudentProfile)
router.route('/me/teacher').put(protect, userController.updateMyTeacherProfile)
router.route('/forgot-password').get(protect, admin, userController.forgotPasswordList)
// user position
router.route('/:userId/positions/:positionId').delete(protect, admin, userPositionController.delete)
router.route('/positions/change').put(protect, userPositionController.change)


module.exports = router