const express = require("express");
const User = require("../models/user")
const Exercise = require("../models/exercises")
const checkToken = require("../helpers/tokenCheck.js")
const router = express.Router();

router.use('/', checkToken)
router.post("/createexercise", (req,res)=>{
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

  router.put("/updateexercise", (req,res)=>{
    const {newArray} = req.body;
    if(newArray.length > 0){
    User.findById(req.payload._id, (err, user)=>{
      if(err) res.status(422).json({error: err.message})
      for (const { _id, title, measureType, order } of newArray) {
        Exercise.findByIdAndUpdate(_id, 
          { title: title, measureType: measureType, order: order } , {new:true}, (err, exercise)=>{
          });
        }
        Exercise.find({user: user._id}, (err, exercise)=>{
          if(err) res.status(422).json({error: err.message})
          res.json({exercise})// ???
        })
    })
    }
    else{
      res.status(422).json({error: "Nothing to update."})
    }

  });
// добавить функцию для пересчета order после удаления
  router.post('/deleteexercise', (req, res)=>{
    
    const {itemToDelete} = req.body
   // console.log(itemToDelete)
    
      User.findById(req.payload._id, (err, user)=>{
        if(err) res.status(422).json({error: err.message})
          Exercise.findByIdAndDelete(itemToDelete._id, (err, exercise)=>{
              if(err)res.status(422).json({error: err.message})
              //console.log(exercise);
            });
          
          Exercise.find({user: user._id}, (err, exercise)=>{
            if(err) res.status(422).json({error: err.message})
            //console.log(exercise)
          })
      })
      
     
  })
  
router.post('/editexercise', (req,res)=>{
        console.log("token is good")
        User.findById(req.payload._id, (err, user)=>{
          if(err) res.status(407).json({error: err.message})
          Exercise.find({user: user._id}).sort({order: 1}).exec( (err, exercise)=>{
            
            if(err) res.status(505).json({error: err.message})
            console.log("sending response")
            res.json({data: exercise})
          })
          
        })  
    })

module.exports = router