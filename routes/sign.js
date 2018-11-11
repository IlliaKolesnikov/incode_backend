const express = require("express");
const User = require("../models/user")
const jwt = require('jsonwebtoken')
const v4 = require('node-uuid')
const keygen = require("keygenerator");
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
router.post('/signup', [check('username').isEmail()], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: "Email is not valid" });
  }

    User.findOne({ name: req.body.username }, (err, user)=>{
      if(err){
        return res.status(400).json({error: err.message })
      }
      if(user){
        return res.status(400).json({error: "User is already exist"})
      }
      //регистрировать только в том случае, если пользователь ещё не зареган
      else{
      User.hashPassword(req.body.password, (err, passwordHash) => {
        if (err) {
          return res.status(400).json({ error: err.message })
        }
  
        const user = new User({
          name: req.body.username,
          password: req.body.password,
          isActivated: false,
          activationKey: keygen._()
        })
  
        user.passwordHash = passwordHash
        user.save((err, item) => {
          if (err) {
            return res.status(400).json({ error: err.message })
          }
          console.log(`http://localhost:3000/verify/${req.body.username}/${user.activationKey}`);

        })
      })
    }
    })
  
    
  })

router.post('/signin', (req, res, next) => {
    const password = req.body.password
      User.findOne({ name: req.body.username }, (err, user) => {
        if (err) {
          console.log(JSON.stringify(err))
          return res.status(400).json({ error: err.message })
        }
        if (!user) {
          return res.status(400).json({ error: 'User not found' })
        }
        if(user.isActivated === false){
          return res.status(400).json({error: "User is not activated"})
        }
        User.comparePasswordAndHash(password, user.passwordHash, (err, areEqual) => {
          if (err) {
            return res.status(400).json({ error: err.message })
          }
          if (!areEqual) {
            return res.status(400).json({ error: 'Wrong password' })
          }
          const payload = {
            _id: user._id,
            iss: 'http://localhost:8080',
            permissions: 'poll',
            mail: user.name
          }
          const options = {
            expiresIn: '1d',
            jwtid: v4(),
          }
          const secret = new Buffer("test", 'base64')
          jwt.sign(payload, secret, options, (err, token) => {
            return res.json({ data: token})
          })
        })
      })
    
  })
  router.post('/verify', (req,res,next) =>{
    User.findOneAndUpdate({name: req.body.username}, {activationKey: "", isActivated: true}, {new: true}, (err, user)=>{
      if(err){
       return res.status(400).json({error: err.message})
      }
      const payload = {
        _id: user._id,
        mail: user.name,
        iss: 'http://localhost:8080',
        permissions: 'poll',
      }
      const options = {
        expiresIn: '7d',
        jwtid: v4(),
      }
      const secret = new Buffer("test", 'base64')
      jwt.sign(payload, secret, options, (err, token) => {
        if(err){
          return res.status(400).json({error: err.message})
        }
        return res.json({ data: token, mail: user.name })
      })

    })
  })

module.exports = router