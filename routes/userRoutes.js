const express = require('express')
const config = require('../config')
const { protect, teacher } = require('../middlewares/authMiddleware')
const userController = require(`../modules/${config.APP_VERSION}/user/userController`)
const userPositionController = require(`../modules/${config.APP_VERSION}/userPosition/userPositionController`)

const router = express.Router()
// user
router.route('/forgot-password').get(protect, teacher, userController.forgotPasswordList)
router.route('/me').put(protect, userController.updateMyProfile)
router.route('/me/student').put(protect, userController.updateMyStudentProfile)
router.route('/me/teacher').put(protect, userController.updateMyTeacherProfile)
router.route('/:id/student-by-admin').put(protect, teacher, userController.updateStudentByAdmin)
router.route('/').get(protect, userController.list)
router.route('/download').get(protect, userController.download)
router.route('/:id').get(protect, userController.detail)
router.route('/:id').delete(protect, teacher, userController.delete)
// user position
router.route('/:userId/positions/:positionId/hard-delete').delete(protect, teacher, userPositionController.hardDelete)
router.route('/:userId/positions/:positionId').delete(protect, teacher, userPositionController.delete)
router.route('/positions')
    .post(protect, userPositionController.create)
    .put(protect, userPositionController.change)


module.exports = router