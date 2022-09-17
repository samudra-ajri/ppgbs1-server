import express from 'express'
import { createEvent, deleteEvent, getAllEvents, getEvent, getEvents, updateEvent } from '../controllers/eventController.js'
import { manager, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()
router.route('/')
    .get(protect, getEvents)
    .post(protect, manager, createEvent)
router.route('/admin').get(protect, manager, getAllEvents)
router.route('/:id')
    .get(protect, getEvent)
    .put(protect, manager, updateEvent)
    .delete(protect, manager, deleteEvent)

export default router