const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const logger = require("morgan");
const sign = require("./routes/sign.js")
const exercise = require("./routes/exercises.js")
const workout = require("./routes/workouts.js")


const API_PORT = 8080;
const app = express();

// this is our MongoDB database
const dbRoute = "mongodb://incode_server:incode1@ds157503.mlab.com:57503/incode_server";

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
app.use("/api", workout);
  

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));