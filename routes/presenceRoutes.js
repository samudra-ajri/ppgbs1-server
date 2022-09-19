import express from 'express'
import { createPresence, getPresences, getPresencesByRoomId, isPresent } from '../controllers/presenceController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .get(protect, manager, getPresences)
    .post(protect, createPresence)
router.route('/event/:roomId')
    .get(protect, manager, getPresencesByRoomId)
router.route('/event/:roomId/ispresent')
    .get(protect, isPresent)

export default router