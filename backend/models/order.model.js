const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      cantidad: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  estado: { type: String, default: 'pendiente' }, 
  fechaPedido: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
