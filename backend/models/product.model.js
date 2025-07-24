const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  imagen: { type: String },
  categoria: { type: String },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
