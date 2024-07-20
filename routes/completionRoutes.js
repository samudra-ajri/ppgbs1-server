const express = require('express')
const config = require('../config')
const { protect, teacher } = require('../middlewares/authMiddleware')
const completionController = require(`../modules/${config.APP_VERSION}/completion/completionController`)

const router = express.Router()
router.route('/')
    .get(protect, completionController.list)
    .post(protect, completionController.create)
    .delete(protect, completionController.delete)
router.route('/me').get(protect, completionController.me)
router.route('/users/:userId/download').get(protect, completionController.download)
router.route('/users/:userId/create-by-admin').post(protect, teacher, completionController.createByAdmin)
router.route('/sum/:structure/users/:userId').get(protect, completionController.sumUser)
router.route('/sum/:structure/users').get(protect, completionController.sumUsers)
module.exports = router