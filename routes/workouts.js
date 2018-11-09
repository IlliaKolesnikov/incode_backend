const express = require("express");
const User = require("../models/user")
const Workout = require("../models/workout")
const Exercise = require("../models/exercises")
const checkToken = require("../helpers/tokenCheck.js")
const router = express.Router();

router.use('/', checkToken)

router.post("/editworkout", (req, res)=>{
  User.findById(req.payload._id, (err, user)=>{
    if(err){
      res.status(502).json({error: err.message})
    }

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
        for (const { name, repeats, measure } of dataToCreate) {
            suda.push({exercise: name, repeats: repeats, measure: measure})
          }
          const workout = new Workout({
            exercises: suda,
            user: user._id,
            date: Date.now()
          })
          workout.save((err,item)=>{
            if(err) res.status(502).json({error: err.message})
            console.log(item)
          })
      })
    })
            
          
      })
  })

  router.post("/getworkout", (req,res)=>{
    User.findById(req.payload._id, (err, user)=>{
      if(err) res.status(503).json(err.message)
      Workout.find({user: user._id}, (err, workout)=>{
        if(err) res.status(503).json({error: err.message})
        res.json({data: workout})
      })
    })
  })

  /*
  for (const { name, repeats, measure } of dataToCreate) {

            const workout = new Workout({
              exercises: [{
                exercise: name,
                repeats: repeats,
                measure: measure
              }],
              user: user._id,
              date: Date.now()
            })
            
           
          }
          workout.save((err,item=>{
            if(err) res.status(502).json({error: err.message})
            
          }))*/

  router.post("/getworkout", (req,res)=>{
    User.findById(req.payload._id, (err,user)=>{
      if(err) res.status(502).json(err.message)
        Workout.findById(req.body.workout._id, (err, user)=>{
          if(err) res.status(502).json(err.message)
              for (const { _id, title, measureType, order } of newArray) {
                Exercise.findByIdAndUpdate(_id, 
                  { title: title, measureType: measureType, order: order } , {new:true}, (err, exercise)=>{
                  });
                }
            })
        })
    })
  router.put("/updateworkout", (req,res)=>{
    User.findById(req.payload._id, (err,user)=>{
      if(err) res.status(502).json(err.message)
        Workout.findById(req.body.workout._id, (err, user)=>{
          if(err) res.status(502).json(err.message)
              for (const { _id, title, measureType, order } of newArray) {
                Exercise.findByIdAndUpdate(_id, 
                  { title: title, measureType: measureType, order: order } , {new:true}, (err, exercise)=>{
                  });
                }
            })
        })
    })
  
  

module.exports = router