import express from 'express'
import { manager, protect } from '../middlewares/authMiddleware.js'
import { 
    deleteUser,
    getMe,
    getUserById,
    getUsers,
    loginUser,
    registerUser,
    updateMe,
    updateUserByManager, 
} from '../controllers/userController.js'

const router = express.Router()
router.route('/')
    .get(protect, manager, getUsers)
    .post(registerUser)
router.route('/login')
    .post(loginUser)
router.route('/me')
    .get(protect, getMe)
    .put(protect, updateMe)
router.route('/:id')
    .get(protect, manager, getUserById)
    .put(protect, manager, updateUserByManager)
    .delete(protect, manager, deleteUser)

export default router