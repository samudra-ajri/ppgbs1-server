import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { 
    getMe,
    loginUser,
    registerUser,
    updateMe, 
} from '../controllers/userController.js'

const router = express.Router()
router.route('/').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getMe).put(protect, updateMe)

export default router