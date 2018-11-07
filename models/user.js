const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
let bcrypt_cost = 12

const userSchema = new Schema({
  name: { type: String, required: true },
  passwordHash: String,
  isActivated: Boolean,
  activationKey: String,
})

userSchema.statics.hashPassword = (passwordRaw, cb) => {
  if (process.env.NODE_ENV === 'test') {
    bcrypt_cost = 1
  }
  bcrypt.hash(passwordRaw, bcrypt_cost, cb)
}

userSchema.statics.comparePasswordAndHash = (password, passwordHash, cb) => {
  bcrypt.compare(password, passwordHash, cb)
}

const User = mongoose.model('User', userSchema)

module.exports = User
