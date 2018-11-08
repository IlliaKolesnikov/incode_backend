const express = require("express");
const User = require("../models/user")
const Workout = require("../models/Workout")
const checkToken = require("../helpers/tokenCheck.js")
const router = express.Router();

router.use('/', checkToken)
router.post("/createworkout", (req,res)=>{
        User.findById(req.payload._id, (err, user)=>{
          if(err){
            res.status(422).json({error: err.message})
          }
          if(req.body != null && req.body.measureType != null){
            Exercise.find({user: user._id}, (err, exercises)=>{
              if(err) res.status(505).json({error: err.message})
              const exercise = new Exercise({
                title: req.body.title,
                measureType: req.body.measureType,
                user: user._id,
                order: exercises.length
              })
              exercise.save((err, item)=>{
                if(err){
                 return res.status(400).json({error: err.message})
                }
                return res.json({exercise: item})
              })
            })
          }
          else{
            res.status(422).json({error: "Not enough information."})
          }

      })
});