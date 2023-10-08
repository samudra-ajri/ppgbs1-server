const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const completionController = require(`../modules/${config.APP_VERSION}/completion/completionController`)

const router = express.Router()

module.exports = router