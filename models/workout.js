const mongoose = require('mongoose')
const Schema = mongoose.Schema


const valuesOfExercise = new Schema({
  exercise: {type: Schema.Types.ObjectId, ref: "Exercise"},
  repeats: {type: Number, required: true},
  measure: {type: Number, required: true},
  order: {type: Number}
})
const workoutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: {type: Date},
  exercises: [valuesOfExercise]
})

const Workout = mongoose.model("Workout", workoutSchema);


module.exports = Workout 