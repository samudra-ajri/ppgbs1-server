const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const directoryController = require(`../modules/${config.APP_VERSION}/directory/directoryController`)

const router = express.Router()
router.route('/')
    .get(protect, admin, directoryController.list)
    .post(protect, admin, directoryController.create)
router.route('/:id')
    .delete(protect, admin, directoryController.delete)

module.exports = router