
import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/APIFeatures.js';

const aliasTopTours = (req, res, next) => { 
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();

}



const getAllTours = async (req, res) => {
    debugger
    try {
        // console.log(req.query)

        //Execute query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }

        })

    } catch (err) {
        res.status(404).json({
            message: 'fail',
            error: err.message
        })
        
    }
    

}

const getTour = async (req, res) => {
    debugger
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

const createTour = async (req, res) => {
    debugger
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }

        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }




}

const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
               tour
            }
    
        })
        
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
   
}

const deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour: null
            }
    
        })
        
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
    
}

const getTourStats = async (req, res) => { 
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }

        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })

        
    } catch (err) {
        res.status(404).json({
            message: 'fail',
            error: err.message
        })
    }
}

const getMonthlyPlan = async (req, res) => { 
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
           
        ])

        res.status(200).json({
            status: 'success',
            results: plan.length,
            data: {
                plan
            }
        
        })
        
    } catch (err) {
        res.status(404).json({
            message: 'fail',
            error: err.message
        })
    }
}


export {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan

}
