const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const completionController = require(`../modules/${config.APP_VERSION}/completion/completionController`)

const router = express.Router()
router.route('/')
    .get(protect, completionController.list)
    .post(protect, completionController.create)
router.route('/me')
    .get(protect, completionController.me)
module.exports = router