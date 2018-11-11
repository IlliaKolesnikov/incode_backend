const express = require("express");
const User = require("../models/user")
const Workout = require("../models/workout")
const Exercise = require("../models/exercises")
const checkToken = require("../helpers/tokenCheck.js")
const router = express.Router();

router.use('/', checkToken)

router.post("/editworkout", (req, res)=>{
  Workout.update({_id: req.body._id}, {$push: {exercises: { $sort: {order: 1}}}})
  Workout.find({user: req.payload._id}).populate({path: 'exercises.exercise'})
      .exec((err, item)=>{
        item.map((ex, i)=>{
          console.log(ex)
          res.json({data: ex})
        })
      })
})

router.post("/createworkout", (req,res)=>{
  const { dataToCreate } = req.body
  User.findById(req.payload._id, (err,user)=>{
    if(err) res.status(502).json(err.message)
    Workout.find({user: user._id}, (err, workouts)=>{
      if(err) res.status(505).json({error: err.message})
      Exercise.find({user: user._id}, (err, exercises)=>{
        const suda =[]
        let count = 0;
        for (const { name, repeats, measure } of dataToCreate) {
          console.log(count)
            suda.push({exercise: name, repeats: repeats, measure: measure, order: count})
            count = count+1;
          }
          const workout = new Workout({
            exercises: suda,
            user: user._id,
            date: Date.now()
          })
          
          workout.save((err,item)=>{
            if(err) res.status(502).json({error: err.message})
            res.json("SAVED")
          })
      })
    })
            
          
      })
  })

  router.post('/deletewexercise', async (req, res)=>{
    const {itemToDelete} = req.body
    console.log("To Delete", itemToDelete)
    Workout.update({ }, { $pull: { "exercises": { _id : itemToDelete._id } } },
  { multi: true }, (err, user)=> console.log(err)
);

  
    await Workout.find({user: req.payload._id}).populate({path: 'exercises.exercise'})
      .exec((err, item)=>{
        item.map((ex, i)=>{
           let arr = [...ex.exercises]
          arr.map(async (exer, index)=>{
            await Workout.update({_id: ex._id, "exercises":{ $elemMatch:{"_id" : exer._id }}}, 
            {$set:{"exercises.$.order" : index}}, (err,user)=> console.log(err))
          })
        })
      })
      res.json("DELETED")

  })

  router.post("/getworkout", (req,res)=>{
 
      Workout.find({user: req.payload._id}).populate({path: 'exercises.exercise'})
      .exec((err, item)=>{
        //res.json({data: item})
       /* item.map((ex, i)=>{
          res.json({data: ex})
        })*/
      })
    
  })


  router.put("/updateworkout", async (req,res)=>{
    const { newArray } = req.body
    console.log(" show array: ", newArray)
    for (const { _id, title, measurement, repeats, order } of newArray.exercises) {
     await Workout.update({_id: newArray._id, "exercises":{ $elemMatch:{"_id" : _id }}}, 
            {$set:{"exercises.$.order" : order, "exercises.$.title" : title,
                  "exercises.$.measurement" : measurement, "exercises.$.repeeats" : repeats}}, 
                  (err,user)=> {if(err) console.log(err.message)})
                }
           await Workout.find({user: req.payload._id}).populate({path: 'exercises.exercise'})
      .exec((err, item)=>{
        item.map((ex, index)=>{
          console.log(ex)
        })
      })
        res.json("UPDATED")
    })
  
  

module.exports = router