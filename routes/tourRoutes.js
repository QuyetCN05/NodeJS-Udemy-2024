import express from 'express';
import {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    checkID
} from '../controllers/tourControllers.js';




const router = express.Router();

router.param('id', checkID)
router.route('/')
    .get(getAllTours)
    .post(createTour)

router.route('/:id')
    .get(getTour).
    patch(updateTour).
    delete(deleteTour)

export default router;