const User = require('../models/user.model');       // IMPORTAMOS EL MODELO DE USUARIO
const bcrypt = require('bcrypt');                   // IMPORTAMOS BCRYPT PARA ENCRIPTAR CONTRASEÑAS


// ==================== FUNCIONES AUXILIARES ====================

// VALIDAR FORMATO DE EMAIL
const isValidEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};


// ==================== GET ====================

// OBTENER TODOS LOS USUARIOS (SOLO ADMIN) - NO DEVUELVE CONTRASEÑAS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');   // BUSCA TODOS LOS USUARIOS SIN CONTRASEÑA
    res.status(200).json(users);                           // RESPONDE CON LISTA DE USUARIOS
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });  // ERROR EN BASE DE DATOS
  }
}

// OBTENER UN USUARIO POR ID - SIN MOSTRAR LA CONTRASEÑA
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;                                         // EXTRAEMOS EL ID DE LA URL
    const user = await User.findById(id).select('-password');          // BUSCAMOS USUARIO POR ID Y OCULTAMOS CONTRASEÑA
    if (!user) {
      return res.status(404).json({ message: 'User not found' });      // SI NO SE ENCUENTRA, ERROR 404
    }
    res.status(200).json(user);                                        // RESPUESTA EXITOSA
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });   // ERROR EN BASE DE DATOS
  }
}


// ==================== PUT ====================

// ACTUALIZAR UN USUARIO
const updateUser = async (req, res) => {
  const { id } = req.params;                           // OBTENEMOS EL ID DE USUARIO DESDE LA URL
  let { nombre, email, password, esAdmin } = req.body; // OBTENEMOS DATOS NUEVOS DESDE EL BODY

  try {
    const user = await User.findById(id);              // BUSCAMOS EL USUARIO POR ID
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // SI NO EXISTE, ERROR
    }

    // VALIDACIÓN DE NOMBRE VACÍO
    if (nombre !== undefined && nombre.trim() === '') {
      return res.status(400).json({ message: 'El nombre no puede estar vacío' });
    }

    // VALIDACIÓN DE EMAIL
    if (email !== undefined && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // VALIDACIÓN DE CONTRASEÑA (MÍNIMO 6 CARACTERES)
    if (password !== undefined && password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // VALIDACIÓN DE esAdmin (DEBE SER BOOLEANO)
    if (esAdmin !== undefined && typeof esAdmin !== 'boolean') {
      return res.status(400).json({ message: 'El campo esAdmin debe ser verdadero o falso' });
    }

    // SI SE PROPORCIONA UNA NUEVA CONTRASEÑA, LA HASHEAMOS
    if (password) {
      password = await bcrypt.hash(password, 10);
    } else {
      password = user.password; // MANTENEMOS LA CONTRASEÑA ACTUAL SI NO SE ACTUALIZA
    }

    // ACTUALIZAMOS EL USUARIO
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        nombre: nombre || user.nombre,
        email: email || user.email,
        password,
        esAdmin: esAdmin !== undefined ? esAdmin : user.esAdmin
      },
      { new: true } // DEVOLVER EL DOCUMENTO ACTUALIZADO
    ).select('-password'); // OCULTAR CONTRASEÑA EN LA RESPUESTA

    res.status(200).json(updatedUser); // RESPUESTA CON EL USUARIO ACTUALIZADO

  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error }); // ERROR EN BASE DE DATOS
  }
};


// ==================== DELETE ====================

// ELIMINAR UN USUARIO POR ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;                             // OBTENER ID DE LA URL
    const deletedUser = await User.findByIdAndDelete(id);  // ELIMINAR USUARIO POR ID
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });  // SI NO SE ENCUENTRA, ERROR 404
    }
    res.status(200).json({ message: 'User deleted successfully' }); // CONFIRMACIÓN DE ELIMINACIÓN
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error }); // ERROR EN BASE DE DATOS
  }
};


// ==================== EXPORTACIONES ====================

module.exports = {
  getAllUsers,     // EXPORTAMOS FUNCIÓN PARA OBTENER TODOS LOS USUARIOS
  getUserById,     // EXPORTAMOS FUNCIÓN PARA OBTENER UNO POR ID
  updateUser,      // EXPORTAMOS FUNCIÓN PARA ACTUALIZAR USUARIO
  deleteUser       // EXPORTAMOS FUNCIÓN PARA ELIMINAR USUARIO
};
