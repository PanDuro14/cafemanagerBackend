const express = require('express'); 
const router = express.Router(); 
const userController = require('../../controller/usersController'); 
const { verifyRecaptcha } = require("../../middlewares/recaptcha"); 
const verifyToken = require('../../middlewares/authMiddleware'); 
// Propiedad de Jesús Morales

router
  .post("/forgot-password", userController.forgotPassword) // recuperar contraseña
  .put("/chage-pass", userController.changePass)           // cambiar contraseña (typo)
  .get('/', userController.getAllUsers)                    // listar usuarios
  .get('/:id', userController.getOneUser)                  // obtener usuario por id
  .post('/', userController.createUser)                    // crear usuario
  .post('/login', userController.login)                    // login
  //.post('/login', verifyRecaptcha, userController.login) // login con recaptcha
  .post('/email', userController.checkEmail)               // validar email
  .post('/fullname', userController.checkUsername);        // validar nombre

module.exports = router;
