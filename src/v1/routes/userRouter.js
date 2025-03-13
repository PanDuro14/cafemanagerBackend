const express = require('express'); 
const router = express.Router(); 
const userController = require('../../controller/usersController'); 
const { verifyRecaptcha } = require("../../middlewares/recaptcha"); 

// Propiedad de Jesús Morales 

router
    .post("/forgot-password", userController.forgotPassword)
    .put("/chage-pass", userController.changePass)
    .get('/', userController.getAllUsers)
    .get('/:id', userController.getOneUser)
    .post('/', userController.createUser)
    .post('/login',  userController.login)
    //.post('/login', verifyRecaptcha, userController.login)
    .post('/email', userController.checkEmail)
    .post('/fullname', userController.checkUsername)

module.exports = router; 