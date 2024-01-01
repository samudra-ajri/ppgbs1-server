const express = require('express')
const config = require('../config')
const organizationController = require(`../modules/${config.APP_VERSION}/organization/organizationController`)

const router = express.Router()
// user
router.route('/').get(organizationController.list)


module.exports = router