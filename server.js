const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const logger = require("morgan");
const sign = require("./routes/sign.js")
const exercise = require("./routes/exercises.js")


const API_PORT = 8080;
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

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


app.use("/api", sign);
app.use("/api", exercise);
  

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));