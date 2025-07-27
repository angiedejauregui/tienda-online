const mongoose = require("mongoose");

// ✅ DEFINIMOS EL ESQUEMA DE LA ORDEN
const orderSchema = new mongoose.Schema({
  // ✅ USUARIO QUE REALIZA LA ORDEN (REFERENCIA AL MODELO DE USUARIO)
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // RELACIÓN CON EL MODELO 'User'
    required: true
  },

  // ✅ LISTA DE PRODUCTOS COMPRADOS
  productos: [
    {
      // ✅ REFERENCIA AL PRODUCTO
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // RELACIÓN CON EL MODELO 'Product'
        required: true
      },

      // ✅ CANTIDAD DE ESE PRODUCTO
      cantidad: {
        type: Number,
        required: true,
        min: 1 // NO SE PERMITEN CANTIDADES MENORES A 1
      }
    }
  ],

  // ✅ TOTAL DE LA COMPRA
  total: {
    type: Number,
    required: true,
    min: 0 // NO SE PERMITEN TOTALES NEGATIVOS
  },

  // ✅ DIRECCIÓN COMPLETA DE ENVÍO
  direccionEnvio: {
    calle: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    pais: { type: String, required: true }
  },

  // ✅ ESTADO DE LA ORDEN (ENUM CON OPCIONES RESTRINGIDAS)
  estado: {
    type: String,
    enum: ["pendiente", "en_proceso", "enviado", "entregado", "cancelado"],
    default: "pendiente" // VALOR POR DEFECTO AL CREAR ORDEN
  },

  // ✅ FECHA EN LA QUE SE CREÓ LA ORDEN
  fechaPedido: {
    type: Date,
    default: Date.now // SE ESTABLECE AUTOMÁTICAMENTE LA FECHA ACTUAL
  }
});

// ✅ EXPORTAMOS EL MODELO CON NOMBRE 'Order'
module.exports = mongoose.model("Order", orderSchema);
