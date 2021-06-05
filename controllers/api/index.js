const router = require('express').Router();
const db = require('../../models');

// CREATE add a new workout
router.post('/workouts', ( {body}, res) => {
    db.Workout.create(body)
    .then(workoutdb => {
        res.json(workoutdb);
    })
    .catch(error => {
        res.json(error);
    });
});


// READ retrieve workouts
router.get('/workouts', (req, res) => {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: { $sum: "$exercises.duration"}
        }
    }])
        .then(workoutdb => {
            res.json(workoutdb);
        })
    .catch(error => {
        res.status(500).json(error);
    });
});

//READ a specific range
router.get('/workouts/range', (req, res) => {
    db.Workout.aggregate([{
        $addFields: {
            totalDuration: { $sum: "$exercises.duration"}
        }
    }]).skip(3).sort({datetime: 1}).limit(7)
        .then(workoutdb => {
            res.json(workoutdb);
        })
    .catch(error => {
        res.status(500).json(error);
    });
})

// UPDATE an existing workout
router.put('/workouts/:id', ( {body, params}, res) => {
    db.Workout.findOneAndUpdate({_id: params.id}, {$push: {exercises: body} })
    .then(workoutdb => {
        res.json(workoutdb)
    })
    .catch(error => {
        res.status(400).json(error);
    });
});


module.exports = router;