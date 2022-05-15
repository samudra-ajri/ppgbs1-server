import express from 'express'
import { 
    createCompletion, 
    deleteCompletion, 
    getCompletion, 
    getCompletionByAdmin, 
    getCompletions, 
    getCompletionsByAdmin
} from '../controllers/completionController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .get(protect, getCompletions)
    .post(protect, createCompletion)
router.route('/admin')
    .get(protect, manager, getCompletionsByAdmin)
router.route('/:id/admin')
    .get(protect, getCompletion)
    .delete(protect, manager, getCompletionByAdmin)
router.route('/:id')
    .get(protect, getCompletion)
    .delete(protect, deleteCompletion)

export default router