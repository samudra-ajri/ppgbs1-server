import express from 'express'
import { createAttendance, getAttendances, isAttended } from '../controllers/attendanceController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/').post(protect, createAttendance)
router.route('/room/:roomId/isAttended').get(protect, isAttended)
router.route('/room/:roomId').get(protect, manager, getAttendances)

export default router