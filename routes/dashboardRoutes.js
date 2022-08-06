import express from 'express'
import { getDashboard } from '../controllers/dashboardController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .get(protect, manager, getDashboard)

export default router