const mongoose = require('mongoose')
const Schema = mongoose.Schema

const exerciseSchema = new Schema({
  title: { type: String, required: true },
  measureType: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  order: { type: Number }
})

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise