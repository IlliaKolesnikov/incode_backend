
const express = require("express");
const jwt = require('jsonwebtoken')
const router = express.Router();
router.use('/', (req,res, next)=>{
  //console.log(req.headers)
  //console.log(req.headers.authorization)
      const cert = new Buffer("test", 'base64')
    jwt.verify(req.headers.authorization, cert, { algorithms: ['HS256'] }, function (err, payload) {
      if(err){
        console.log("token err");
        res.status(422).json({error: err.message})
      } // if token alg != RS256,  err == invalid signature
      else{
          req.payload = payload;
          //console.log(req.payload)
        next()
      }
    
    })
})

module.exports = router