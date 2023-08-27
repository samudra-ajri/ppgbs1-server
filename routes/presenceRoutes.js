import express from 'express'
import {
    createPresence,
    createPresenceByAdmin,
    getPresences,
    getPresencesByRoomId,
    isPresent,
    removeAttender
} from '../controllers/presenceController.js'
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
router.route('/room/:roomId/attender/:attenderId')
    .delete(protect, manager, removeAttender)

export default router