const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const materialController = require(`../modules/${config.APP_VERSION}/material/materialController`)

const router = express.Router()
router.route('/').get(protect, materialController.list)

module.exports = router