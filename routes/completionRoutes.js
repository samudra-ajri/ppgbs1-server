import express from 'express'
import { createCompletion } from '../controllers/completionController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .post(protect, createCompletion)

export default router