import express from 'express'
import { createPresence, getPresences, getPresencesByRoomId } from '../controllers/presenceController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .get(protect, manager, getPresences)
    .post(protect, createPresence)
router.route('/event/:roomId')
    .get(protect, manager, getPresencesByRoomId)

export default router