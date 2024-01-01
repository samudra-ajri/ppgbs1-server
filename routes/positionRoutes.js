const express = require('express')
const config = require('../config')
const positionController = require(`../modules/${config.APP_VERSION}/position/positionController`)

const router = express.Router()
// user
router.route('/').get(positionController.list)


module.exports = router