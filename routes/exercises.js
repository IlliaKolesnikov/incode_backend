const express = require("express");
const User = require("../models/user")
const Exercise = require("../models/exercises")
const checkToken = require("../helpers/tokenCheck.js")
const router = express.Router();

router.use('/', checkToken)
router.post("/createexercise", (req,res)=>{
       console.log(req.body)
        Exercise.find({user: req.payload._id}, (err, exercises)=>{
          if(err) res.status(505).json({error: err.message})
            const exercise = new Exercise({
              title: req.body.title,
              measureType: req.body.measureType,
              user: req.payload._id,
              order: exercises.length
            })
            exercise.save((err, item)=>{
              if(err){
                return res.status(400).json({error: err.message})
              }
              return res.json({exercise: item})
            })
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
          res.json({exercise})
        })
    })
    }
    else{
      res.status(422).json({error: "Nothing to update."})
    }

  });

  router.post('/deleteexercise', async (req, res)=>{
    const {itemToDelete} = req.body

    Exercise.deleteOne({_id: itemToDelete._id}, (err, exercise)=>{
      if(err)res.status(422).json({error: err.message})
    });
    var array = await Exercise.find({user: req.payload._id}).sort({order: 1})
    array.map((item, index)=>{
        Exercise.findByIdAndUpdate ( item._id, {order: index}, (err) => {
      if (err) res.status(422).json({error: err.message }) })
    })
      res.json("DELETED");
      Exercise.find({user: req.payload._id}).sort({order: 1}).exec( (err, item)=>{
      console.log("arr for each result", item)
      
    })
      
     
  })
  
router.post('/editexercise', (req,res)=>{
        console.log("token is good")
          Exercise.find({user: req.payload._id}).sort({order: 1}).exec( (err, exercise)=>{
            if(err) res.status(505).json({error: err.message})
            console.log("sending response")
            res.json({data: exercise})
          })
          
          
})

module.exports = router