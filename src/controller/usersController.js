const userProcess = require('../process/userProces'); 
const jwt = require('jsonwebtoken'); 
const { sendResetEmail } = require("../utils/mailer"); 
require('dotenv').config(); 

// Propiedad de Jesús Morales

// Iniciar sesión y generar token JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const result = await userProcess.login(email, password); 

    if (result) {
      const token = jwt.sign({ userid: result.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
      res.status(200).json({ success: true, result, token }); 
    } else {
      res.status(401).json({ success: false }); 
    }
  } catch (error) {
    console.error('Error al iniciar sesión: ', error); 
    res.status(500).json({ error: 'Error al iniciar sesión ', error }); 
  }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await userProcess.getAllUsers(); 
    res.status(200).json(users); 
  } catch (error) {
    console.error('Error al obtener usuarios: ', error); 
    res.status(500).json({ error: 'Error al obtener a los usuarios ', error }); 
  }
};

// Obtener un usuario por ID
const getOneUser = async (req, res) => {
  try {
    const users = await userProcess.getOneUser(req.params.id); 
    res.status(200).json(users); 
  } catch (error) {
    console.error('Error al obtener el usuario: ', error); 
    res.status(500).json({ error: 'Error al obtener al usuario ', error }); 
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body; 
    const newUser = await userProcess.createUser(fullname, email, password);
    res.status(200).json(newUser); 
    console.log('Usuario creado'); 
  } catch (error) {
    console.error('Error al crear al usuario: ', error); 
    res.status(500).json({ error: 'Error al crear al usuario', error }); 
  }
};

// Verificar si el email ya existe
const checkEmail = async (req, res) => {
  try {
    const users = await userProcess.checkEmail(req.body.email); 
    res.status(200).json(users); 
  } catch (error) {
    console.error('Error al comprobar emails: ', error); 
    res.status(500).json({ error: 'Error al comprobar emails', error }); 
  }
};

// Verificar si el nombre de usuario ya existe
const checkUsername = async (req, res) => {
  try {
    const users = await userProcess.checkUsername(req.body.fullname); 
    res.status(200).json(users); 
  } catch (error) {
    console.error('Error al comprobar el nombre de usuario'); 
    res.status(500).json({ error: 'Error al comprobar el nombre de usuario ', error }); 
  }
};

// Enviar correo para recuperar contraseña
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userProcess.findOneByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const emailSent = await sendResetEmail(email, token);

    if (emailSent) {
      return res.json({ message: "Correo de recuperación enviado" });
    } else {
      return res.status(500).json({ message: "Error al enviar el correo de recuperación" });
    }
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ message: "Error interno en recuperación de contraseña" });
  }
};

// Cambiar contraseña usando el token enviado al correo
const changePass = async (req, res) => {
  try {
    const { token, newPass } = req.body;

    if (!token || !newPass) {
      return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' }); 
    }   

    let decoded; 
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); 
    } catch (error) {
      return res.status(400).json({ message: 'Token inválido o expirado' }); 
    }

    const email = decoded.email; 
    if (!email) {
      return res.status(400).json({ message: 'Token inválido: No contiene email' }); 
    }

    const users = await userProcess.changePass(email, newPass); 
    if (users) {
      return res.status(200).json({ message: `Contraseña de ${email} cambiada con éxito` }); 
    } else {
      return res.status(404).json({ message: `Contraseña de ${email} no se pudo cambiar` });  
    }
  } catch (error) {
    console.error('Error al intentar cambiar la contraseña ', error); 
    res.status(500).json({ message: 'Error interno en cambiar la contraseña' }); 
  }
};

module.exports = {
  login,
  getAllUsers,
  getOneUser,
  createUser,
  checkEmail,
  checkUsername,
  forgotPassword,
  changePass,
};
