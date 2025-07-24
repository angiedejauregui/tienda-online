const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  esAdmin: { type: Boolean, default: false },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
