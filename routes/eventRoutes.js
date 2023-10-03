const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const eventController = require(`../modules/${config.APP_VERSION}/event/eventController`)

const router = express.Router()
router.route('/').post(protect, admin, eventController.create)

module.exports = router