const userProcess = require('../process/userProces'); 
const jwt = require('jsonwebtoken'); 
const axios = require("axios"); 
const { sendResetEmail } = require("../utils/mailer"); 
const { json } = require('body-parser');
require('dotenv').config(); 
// Propiedad de Jesús Morales 

const login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        const result =  await userProcess.login(email, password); 
        if(result){
            const token = jwt.sign({ userid: result.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
            
            res.status(200).json({ success: true, result, token }); 
        } else {
            res.status(401).json({ success: false }); 
        }
    } catch (error){
        console.error('Error al iniciar sesión: ', error); 
        res.status(500).json({ error: 'Error al iniciar sesión ', error }); 
    }
}

const getAllUsers = async (req, res) => {
    try{
        const users = await userProcess.getAllUsers(); 
        res.status(200).json(users); 
    } catch (error){
        console.error('Error al obtener usuarios: ', error); 
        res.status(500).json({ error: 'Error al obtener a los usuarios ', error }); 
    }
}

const getOneUser = async (req, res) => {
    try {
        const users = await userProcess.getOneUser(req.params.id); 
        res.status(200).json(users); 
    } catch (error){
        console.error('Error al obtener el usuario: ', error); 
        res.status(500).json({ error: 'Error al obtener al usuarios ', error }); 
    }
}

const createUser = async (req, res) => {
    try {
        const { fullname, email, password} = req.body; 
        const newUser = await userProcess.createUser( fullname, email, password );
        res.status('200').json(newUser); 
        console.log('Usuario creado'); 
    } catch (error) {
        console.error('Error al crear al usuario: ', error); 
        res.status(500).json({ error: 'Error al crear al usuario', error }); 
    }
}


const checkEmail = async (req, res) => {
    try{
        const users = await userProcess.checkEmail( req.body.email); 
        res.status(200).json(users); 
    } catch (error) {
        console.error('Error al comprobar emails: ', error); 
        res.status(500).json({ error: 'Error al comprobar emails', error }); 
    }
}

const checkUsername = async(req, res) => {
    try {
        const users = await userProcess.checkUsername( req.body.fullname ); 
        res.status(200).json(users); 
    } catch (error) {
        console.error('Error al comporbar el nombre de usuario'); 
        res.status(500).json({ error: 'Error al comprobar el nombre de usuario ', error }); 
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userProcess.findOneByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Generamos el token de recuperación con expiración de 1 hora
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Enviamos el correo con el enlace de recuperación
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

const changePass = async (req, res) => {
    try {
        //const { email } = req.params; 
        const { token, newPass } = req.body; 

        if(!token || !newPass){
            return res.status(400).json({ message: 'Token y nueva contraseña son requeridos '}); 
        }   

        let decoded; 
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET); 
        } catch (error){
            return res.status(400).json({ message: 'Token inválido o expirado '}); 
        }

        const email = decoded.email; 
        if(!email){
            return res.status(400).json({ message: 'Token inválido: No contiene email '}); 
        }

        const users = await userProcess.changePass(email, newPass); 
        if(users){
            return res.status(200).json({ message: `Contraseña de ${email} cambiada con éxito `}); 
        } else {
            return res.status(404).json({ message: `Contraseña de ${email} no se pudo cambiar ` });  
        }
        
    } catch (error){
        console.error('Error al intentar cambiar la contraseña ', error); 
        res.status(500).json({ message: 'Error interno en cambiar la contraseña '}); 
    }
}

module.exports = {
    login, 
    getAllUsers, 
    getOneUser, 
    createUser,
    checkEmail,
    checkUsername, 
    forgotPassword, 
    changePass, 
}