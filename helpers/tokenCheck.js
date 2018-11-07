const express = require("express");
const jwt = require('jsonwebtoken')
const router = express.Router();
router.use('/', (req,res, next)=>{//нужно будет изменить тип запроса, а проверку токена в мидлвар кинуть
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
      }
    
    })
})

module.exports = router