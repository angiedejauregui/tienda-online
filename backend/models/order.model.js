const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      cantidad: { type: Number, required: true, min: 1 },
    },
  ],
  total: { type: Number, required: true, min: 0 },
  direccionEnvio: {
    calle: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    pais: { type: String, required: true },
  },
  estado: {
    type: String,
    enum: ["pendiente", "en_proceso", "enviado", "entregado", "cancelado"],
    default: "pendiente",
  },
  fechaPedido: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
