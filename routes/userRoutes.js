const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const userController = require(`../modules/${config.APP_VERSION}/user/userController`)

const router = express.Router()

module.exports = router