import express from 'express';
import {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
} from '../controllers/tourControllers.js';
import { get } from 'mongoose';





const router = express.Router();

//create a checkBody middleware
//check if body contains the name and price property
//if not, send back 400 (bad request)
//add it to the post handler stack

router.route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/')
    .get(getAllTours)
    .post(createTour)

router.route('/:id')
    .get(getTour).
    patch(updateTour).
    delete(deleteTour)

export default router;