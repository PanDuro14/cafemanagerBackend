const userDB = require('../db/usersdb'); 
// Propiedad de Jesús Morales
// Iniciar sesión con email y contraseña
const login = async (email, password) => {
  const users = await userDB.login(email, password); 
  return users; 
}

// Obtener todos los usuarios
const getAllUsers = async () => {
  const users = await userDB.getAllUsers(); 
  return users; 
}

// Obtener un solo usuario por ID
const getOneUser = async (id) => {
  const users = await userDB.getOneUser(id); 
  return users; 
}

// Crear un nuevo usuario
const createUser = async (fullname, email, password) => {
  const users = await userDB.createUser(fullname, email, password); 
  return users; 
}

// Verificar si el email ya está registrado
const checkEmail = async (email) => {
  const users = await userDB.checkEmail(email); 
  return users; 
}

// Verificar si el nombre de usuario ya existe
const checkUsername = async (fullname) => {
  const users = await userDB.checkUsername(fullname); 
  return users; 
}

// Buscar usuario por email
const findOneByEmail = async (email) => {
  const users = await userDB.findOneByEmail(email); 
  return users; 
}

// Cambiar contraseña del usuario
const changePass = async (email, newPass) => {
  const users = await userDB.changePass(email, newPass); 
  return users; 
}

module.exports = {
  login, 
  getAllUsers, 
  getOneUser, 
  createUser,
  checkEmail,
  checkUsername, 
  findOneByEmail, 
  changePass, 
}
