const Order = require("../models/order.model");

const createOrder = async (req, res) => {
  const { productos, total, direccionEnvio } = req.body;
  const usuario = req.user.id;

  if (
    !productos ||
    !total ||
    !direccionEnvio.calle ||
    !direccionEnvio.ciudad ||
    !direccionEnvio.provincia ||
    !direccionEnvio.codigoPostal ||
    !direccionEnvio.pais
  ) {
    return res
      .status(400)
      .json({
        message: "Productos, total y dirección de envío son requeridos",
      });
  }

  try {
    const newOrder = new Order({
      usuario,
      productos,
      total,
      direccionEnvio,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creando la orden", error });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate("usuario", "nombre email")
      .populate("productos.producto", "nombre precio");
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo la orden", error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("usuario", "nombre email")
      .populate("productos.producto", "nombre precio");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo las órdenes", error });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ message: "Estado es requerido" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error actualizando el estado de la orden", error });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json({ message: "Orden eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando la orden", error });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
