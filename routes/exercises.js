const express = require("express");
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const Exercise = require("../models/exercises")
const checkToken = require("../helpers/tokenCheck.js")
const router = express.Router();

/*router.use('/', (req,res, next)=>{//нужно будет изменить тип запроса, а проверку токена в мидлвар кинуть
  console.log("privet, Illia Kolesnikov, kak dela?")
  
    const cert = new Buffer("test", 'base64')
    jwt.verify(req.body.token, cert, { algorithms: ['HS256'] }, function (err, payload) {
      if(err){
        res.status(422).json({error: err.message})
      } // if token alg != RS256,  err == invalid signature
      else{
          console.log("send token")
          req.payload = payload;
        next()
        // poka nichego
      }
    
    })
})*/
router.use('/', checkToken)
router.post("/createexercise", (req,res)=>{
    console.log(req.payload)
    /*const cert = new Buffer("test", 'base64')
    jwt.verify(req.body.token, cert, { algorithms: ['HS256'] }, function (err, payload) {
      if(err){
        res.status(422).json({error: err.message})
      } // if token alg != RS256,  err == invalid signature
      else{*/
        User.findOne({_id: req.payload._id}, (err, user)=>{
          if(err){
            res.status(422).json({error: err.message})
          }
          const exercise = new Exercise({
            title: req.body.title,
            measureType: req.body.measureType,
            user: user._id
          })
          
            exercise.save((err, item)=>{
              if(err){
               return res.status(400).json({error: err.message})
              }
              return res.json({exercise: item})
            })
          
      
          
      })
      //}
    });
  //})

router.post('/editexercise', (req,res)=>{//нужно будет изменить тип запроса, а проверку токена в мидлвар кинуть
  /*const cert = new Buffer("test", 'base64')
  console.log(req.body.token)
    jwt.verify(req.body.token, cert, { algorithms: ['HS256'] }, function (err, payload) {
      if(err){
        res.status(422).json({error: err.message})
      } // if token alg != RS256,  err == invalid signature
      else{*/
        console.log("token is good")
        User.findById(req.payload._id, (err, user)=>{
          Exercise.find({user: user._id}, (err, exercise)=>{
            if(err) res.status(505).json({error: err.message})
            console.log("sending response")
            res.json({data: exercise})
          })
        }
        )
        
        // poka nichego
      
    
    })
//})

module.exports = router