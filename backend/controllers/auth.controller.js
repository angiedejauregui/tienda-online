const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Funciones para validar email y contraseña con expresiones regulares y reglas claras
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
const isValidPassword = (password) => password && password.length >= 6;

const registerUser = async (req, res) => {
  const { nombre, email, password, confirmPassword } = req.body;

  // Verificar que todos los campos necesarios estén presentes
  if (!nombre || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Nombre, email, password y confirmación son requeridos' });
  }

  // Validar formato correcto del email
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  // Validar que la contraseña cumpla con la longitud mínima
  if (!isValidPassword(password)) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  // Confirmar que password y confirmPassword coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    // Evitar registros con emails duplicados
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ya está en uso' });
    }

    // Encriptar contraseña para seguridad
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar nuevo usuario en la base de datos
    const newUser = new User({
      nombre,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    // Capturar y responder en caso de error inesperado
    res.status(500).json({ message: 'Error al crear el usuario', error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validar presencia de email y contraseña
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son requeridos' });
  }

  // Validar formato de email antes de buscar usuario
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que la contraseña coincida con la almacenada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT con datos mínimos para autorización
    const token = jwt.sign(
      { id: user._id, esAdmin: user.esAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Responder con token y datos necesarios para frontend
    res.status(200).json({ token, userId: user._id, esAdmin: user.esAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = {
  registerUser,
  loginUser
};
