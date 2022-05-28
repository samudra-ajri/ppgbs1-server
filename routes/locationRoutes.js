import express from 'express'
import { protect, admin } from '../middlewares/authMiddleware.js'
import { 
    createLocation, 
    deleteLocation, 
    getLocation, 
    getLocations,
    updateLocation
} from '../controllers/locationController.js'

const router = express.Router()
router.route('/')
    .get(getLocations)
    .post(protect, admin, createLocation)
router.route('/:id')
    .get(getLocation)
    .put(protect, admin, updateLocation)
    .delete(protect, admin, deleteLocation)

export default router