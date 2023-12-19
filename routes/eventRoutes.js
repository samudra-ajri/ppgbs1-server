const express = require('express')
const config = require('../config')
const { protect, admin } = require('../middlewares/authMiddleware')
const eventController = require(`../modules/${config.APP_VERSION}/event/eventController`)
const presenceController = require(`../modules/${config.APP_VERSION}/presence/presenceController`)

const router = express.Router()
// events
router.route('/')
    .post(protect, admin, eventController.create)
    .get(protect, eventController.list)
router.route('/:id')
    .get(protect, eventController.detail)
    .delete(protect, admin, eventController.delete)
// presences
router.route('/:eventId/presences')
    .post(protect, presenceController.create)
    .get(protect, presenceController.list)
router.route('/:eventId/presences/:userId')
    .get(protect, presenceController.detail)
    .post(protect, presenceController.createByAdmin)
    .delete(protect, presenceController.delete)

module.exports = router