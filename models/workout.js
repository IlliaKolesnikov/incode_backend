const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workoutSchema = new Schema({
  title: { type: String, required: true },
  measurement: {type: String, required: true},
  repeats: {type: Number, required: true},
  exercises: [{type: Schema.Types.ObjectId, ref: "Exercise"}]
})

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout