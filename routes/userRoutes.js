import express from 'express'
import { manager, protect } from '../middlewares/authMiddleware.js'
import { 
    deleteUser,
    forgotPassword,
    getMe,
    getRolesCount,
    getUserById,
    getUsers,
    loginUser,
    registerUser,
    resetPassword,
    updateMe,
    updateUserByManager, 
} from '../controllers/userController.js'

const router = express.Router()
router.route('/')
    .get(protect, manager, getUsers)
    .post(registerUser)
router.route('/roles')
    .get(protect, manager, getRolesCount)
router.route('/login')
    .post(loginUser)
router.route('/me')
    .get(protect, getMe)
    .put(protect, updateMe)
router.route('/forgot-password')
    .put(forgotPassword)
router.route('/reset-password/:token')
    .put(protect, manager, resetPassword)
router.route('/:id')
    .get(protect, manager, getUserById)
    .put(protect, manager, updateUserByManager)
    .delete(protect, manager, deleteUser)

export default router