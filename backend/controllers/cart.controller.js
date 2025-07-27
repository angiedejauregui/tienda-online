const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// 📌 FUNCIÓN AUXILIAR PARA CALCULAR EL TOTAL DEL CARRITO
const calcularTotal = async (productos) => {
  let total = 0;
  for (const item of productos) {
    const product = await Product.findById(item.producto);
    if (product) {
      total += product.precio * item.cantidad;
    }
  }
  return total;
};

// ✅ AGREGAR PRODUCTO AL CARRITO DEL USUARIO
const addProductToCart = async (req, res) => {
  const userId = req.user.id;
  const { productoId, cantidad } = req.body;

  // VALIDAR CAMPOS OBLIGATORIOS
  if (!productoId || !cantidad) {
    console.warn('[❌] PRODUCTO O CANTIDAD NO ENVIADOS');
    return res.status(400).json({ message: 'productoId y cantidad son requeridos' });
  }

  // VALIDAR ID VÁLIDO DE PRODUCTO
  if (!mongoose.Types.ObjectId.isValid(productoId)) {
    console.warn(`[❌] productoId inválido: ${productoId}`);
    return res.status(400).json({ message: 'productoId inválido' });
  }

  try {
    // VERIFICAR QUE EL PRODUCTO EXISTE
    const product = await Product.findById(productoId);
    if (!product) {
      console.warn(`[⚠️] Producto no encontrado con id: ${productoId}`);
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // BUSCAR EL CARRITO DEL USUARIO
    let cart = await Cart.findOne({ usuario: userId });

    if (!cart) {
      // CREAR NUEVO CARRITO SI NO EXISTE
      cart = new Cart({
        usuario: userId,
        productos: [{ producto: productoId, cantidad }],
        fechaActualizacion: new Date()
      });
    } else {
      // SI EXISTE EL CARRITO, VERIFICAR SI EL PRODUCTO YA ESTÁ
      const productoExistente = cart.productos.find(
        item => item.producto.toString() === productoId
      );

      if (productoExistente) {
        // ACTUALIZAR CANTIDAD SI YA ESTÁ EN EL CARRITO
        productoExistente.cantidad += cantidad;
        console.log(`[ℹ️] Cantidad actualizada para producto ${productoId}`);
      } else {
        // AGREGAR NUEVO PRODUCTO AL CARRITO
        cart.productos.push({ producto: productoId, cantidad });
        console.log(`[ℹ️] Producto agregado al carrito`);
      }

      cart.fechaActualizacion = new Date();
    }

    // CALCULAR TOTAL AUTOMÁTICAMENTE
    cart.total = await calcularTotal(cart.productos);
    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    console.error('[❌] Error agregando producto al carrito:', error);
    res.status(500).json({ message: 'Error agregando producto al carrito', error });
  }
};

// ✅ OBTENER CARRITO DEL USUARIO CON PRODUCTOS POPULADOS
const getCartByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ usuario: userId }).populate('productos.producto');

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('[❌] Error obteniendo el carrito del usuario:', error);
    res.status(500).json({ message: 'Error obteniendo el carrito', error });
  }
};

// ✅ ELIMINAR UN PRODUCTO DEL CARRITO DEL USUARIO
const removeProductFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productoId } = req.params;

  // VALIDAR ID DE PRODUCTO
  if (!mongoose.Types.ObjectId.isValid(productoId)) {
    return res.status(400).json({ message: 'ID de producto inválido' });
  }

  try {
    const cart = await Cart.findOne({ usuario: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // FILTRAR EL PRODUCTO A ELIMINAR
    const productosFiltrados = cart.productos.filter(
      item => item.producto.toString() !== productoId
    );

    if (productosFiltrados.length === cart.productos.length) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    // ACTUALIZAR PRODUCTOS Y TOTAL
    cart.productos = productosFiltrados;
    cart.total = await calcularTotal(cart.productos);
    cart.fechaActualizacion = new Date();

    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito', cart });

  } catch (error) {
    console.error('[❌] Error eliminando producto del carrito:', error);
    res.status(500).json({ message: 'Error eliminando producto del carrito', error });
  }
};

// ✅ VACIAR CARRITO COMPLETAMENTE
const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ usuario: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // LIMPIAR ARRAY DE PRODUCTOS Y TOTALIZAR EN 0
    cart.productos = [];
    cart.total = 0;
    cart.fechaActualizacion = new Date();

    await cart.save();

    res.status(200).json({ message: 'Carrito vaciado exitosamente', cart });

  } catch (error) {
    console.error('[❌] Error al vaciar el carrito:', error);
    res.status(500).json({ message: 'Error al vaciar el carrito', error });
  }
};

// ✅ EXPORTAR FUNCIONES DEL CONTROLADOR DE CARRITO
module.exports = {
  addProductToCart,
  getCartByUser,
  removeProductFromCart,
  clearCart
};
