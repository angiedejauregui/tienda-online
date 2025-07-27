const Order = require("../models/order.model"); // ✅ IMPORTAMOS EL MODELO DE ORDEN

// ✅ CREAR UNA NUEVA ORDEN
const createOrder = async (req, res) => {
  const { productos, total, direccionEnvio } = req.body;
  const usuario = req.user.id; // ✅ OBTENEMOS EL ID DEL USUARIO AUTENTICADO

  // ✅ VALIDAMOS CAMPOS REQUERIDOS
  if (
    !productos ||
    !total ||
    !direccionEnvio?.calle ||
    !direccionEnvio?.ciudad ||
    !direccionEnvio?.provincia ||
    !direccionEnvio?.codigoPostal ||
    !direccionEnvio?.pais
  ) {
    console.warn("[⚠️] FALTAN DATOS EN LA CREACIÓN DE LA ORDEN");
    return res.status(400).json({
      message: "Productos, total y dirección de envío son requeridos",
    });
  }

  try {
    // ✅ CREAMOS UNA NUEVA INSTANCIA DEL MODELO Order
    const newOrder = new Order({
      usuario,
      productos,
      total,
      direccionEnvio,
    });

    // ✅ GUARDAMOS LA ORDEN EN LA BASE DE DATOS
    await newOrder.save();

    console.log("[✅] ORDEN CREADA EXITOSAMENTE");
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("[❌] ERROR CREANDO LA ORDEN:", error.message);
    res.status(500).json({ message: "Error creando la orden" });
  }
};

// ✅ OBTENER UNA ORDEN POR SU ID
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ BUSCAMOS LA ORDEN Y POBLAMOS REFERENCIAS
    const order = await Order.findById(id)
      .populate("usuario", "nombre email") // ✅ TRAEMOS NOMBRE Y EMAIL DEL USUARIO
      .populate("productos.producto", "nombre precio"); // ✅ TRAEMOS NOMBRE Y PRECIO DE CADA PRODUCTO

    if (!order) {
      console.warn(`[⚠️] ORDEN NO ENCONTRADA CON ID: ${id}`);
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("[❌] ERROR OBTENIENDO LA ORDEN:", error.message);
    res.status(500).json({ message: "Error obteniendo la orden" });
  }
};

// ✅ OBTENER TODAS LAS ÓRDENES (SOLO ADMIN)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("usuario", "nombre email")
      .populate("productos.producto", "nombre precio");

    res.status(200).json(orders);
  } catch (error) {
    console.error("[❌] ERROR OBTENIENDO TODAS LAS ÓRDENES:", error.message);
    res.status(500).json({ message: "Error obteniendo las órdenes" });
  }
};

// ✅ ACTUALIZAR EL ESTADO DE UNA ORDEN
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // ✅ VALIDAMOS QUE SE ENVÍE UN ESTADO
  if (!estado) {
    return res.status(400).json({ message: "Estado es requerido" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { estado },
      { new: true } // ✅ DEVUELVE EL DOCUMENTO ACTUALIZADO
    );

    if (!updatedOrder) {
      console.warn(`[⚠️] ORDEN NO ENCONTRADA PARA ACTUALIZAR CON ID: ${id}`);
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    console.log(`[✅] ESTADO DE ORDEN ACTUALIZADO: ${id} => ${estado}`);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("[❌] ERROR ACTUALIZANDO ORDEN:", error.message);
    res.status(500).json({
      message: "Error actualizando el estado de la orden",
    });
  }
};

// ✅ ELIMINAR UNA ORDEN (SOLO ADMIN)
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      console.warn(`[⚠️] ORDEN NO ENCONTRADA PARA ELIMINAR CON ID: ${id}`);
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    console.log(`[✅] ORDEN ELIMINADA CON ID: ${id}`);
    res.status(200).json({ message: "Orden eliminada exitosamente" });
  } catch (error) {
    console.error("[❌] ERROR ELIMINANDO LA ORDEN:", error.message);
    res.status(500).json({ message: "Error eliminando la orden" });
  }
};

// ✅ EXPORTAMOS TODAS LAS FUNCIONES DEL CONTROLADOR
module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
