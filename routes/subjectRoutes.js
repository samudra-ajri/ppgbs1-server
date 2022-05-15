import express from 'express'
import { protect, admin } from '../middlewares/authMiddleware.js'
import { 
    createSubject, 
    deleteSubject, 
    getSubject, 
    getSubjects,
    updateSubject
} from '../controllers/subjectController.js'

const router = express.Router()
router.route('/')
    .get(getSubjects)
    .post(protect, admin, createSubject)
router.route('/:id')
    .get(getSubject)
    .put(protect, admin, updateSubject)
    .delete(protect, admin, deleteSubject)

export default router