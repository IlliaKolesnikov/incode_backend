const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const v4 = require('node-uuid')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const logger = require("morgan");
const keygen = require("keygenerator");
const User = require("./user")


const API_PORT = 3001;
const app = express();
const router = express.Router();


// this is our MongoDB database
const dbRoute = "mongodb://sprite:Frank764@ds145121.mlab.com:45121/localserver";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())



router.post('/signup', (req, res, next) => {
  console.log(req.body)
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
            iss: 'http://localhost:3001',
            permissions: 'poll',
          }
          const options = {
            expiresIn: '7d',
            jwtid: v4(),
          }
          const secret = new Buffer("test", 'base64')
          jwt.sign(payload, secret, options, (err, token) => {
            return res.json({ data: token })
          })
        })
      })
    
  })
  


  app.use("/api", router);
  

  app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));