const userService = require('../services/userService'); 

// Propiedad de Jesús Morales

// Iniciar sesión
const login = async (email, password) => {
  const users = await userService.login(email, password); 
  return users; 
}

// Obtener todos los usuarios
const getAllUsers = async () => {
  const users = await userService.getAllUsers(); 
  return users; 
}

// Obtener un usuario por ID
const getOneUser = async (id) => {
  const users = await userService.getOneUser(id); 
  return users; 
}

// Crear nuevo usuario
const createUser = async (fullname, email, password) => {
  const users = await userService.createUser(fullname, email, password); 
  return users; 
}

// Verificar si email ya existe
const checkEmail = async (email) => {
  const users = await userService.checkEmail(email); 
  return users; 
}

// Verificar si nombre de usuario ya existe
const checkUsername = async (fullname) => {
  const users = await userService.checkUsername(fullname); 
  return users; 
}

// Buscar usuario por email
const findOneByEmail = async (email) => {
  const users = await userService.findOneByEmail(email); 
  return users; 
}

// Cambiar contraseña
const changePass = async (email, newPass) => {
  const users = await userService.changePass(email, newPass); 
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
