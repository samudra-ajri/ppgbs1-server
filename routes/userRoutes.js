import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { 
    getMe,
    loginUser,
    registerUser, 
} from '../controllers/userController.js'

const router = express.Router()
router.route('/').post(registerUser)
router.route('/login').post(loginUser)
router.get('/me', protect, getMe)

export default router