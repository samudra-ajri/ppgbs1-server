import express from 'express'
import { createPresence, createPresenceByAdmin, getPresences, getPresencesByRoomId, isPresent } from '../controllers/presenceController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .get(protect, manager, getPresences)
    .post(protect, createPresence)
router.route('/room/:roomId')
    .get(protect, manager, getPresencesByRoomId)
router.route('/room/:roomId/ispresent')
    .get(protect, isPresent)
router.route('/admin')
    .post(protect, manager, createPresenceByAdmin)

export default router