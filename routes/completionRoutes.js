import express from 'express'
import { 
    createCompletion, 
    deleteCompletion, 
    getCompletion, 
    getCompletionByAdmin, 
    getCompletionBySubjectId, 
    getCompletions, 
    getCompletionsByAdmin,
    getCompletionsByCategory,
    getCompletionsScores,
    getUserCompletionByAdmin,
    updateCompletion
} from '../controllers/completionController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .get(protect, getCompletions)
    .post(protect, createCompletion)
router.route('/admin')
    .get(protect, manager, getCompletionsByAdmin)
router.route('/scores')
    .get(protect, getCompletionsScores) 
router.route('/:id/admin')
    .get(protect, manager, getCompletionByAdmin)
router.route('/:id')
    .get(protect, getCompletion)
    .put(protect, updateCompletion)
    .delete(protect, deleteCompletion)
router.route('/user/:userId')
    .get(protect, manager, getUserCompletionByAdmin)
router.route('/categories/:category')
    .get(protect, getCompletionsByCategory)
router.route('/subjects/:subjectId')
    .get(protect, getCompletionBySubjectId)

export default router