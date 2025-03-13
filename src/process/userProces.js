const userService = require('../services/userService'); 

const login = async(email, password) => {
    const users = await userService.login(email, password); 
    return users; 
}

const getAllUsers = async() => {
    const users = await userService.getAllUsers(); 
    return users; 
}
// Propiedad de Jesús Morales 

const getOneUser = async(id) => {
    const users = await userService.getOneUser(id); 
    return users; 
}

const createUser = async(fullname, email, password) => {
    const users = await userService.createUser(fullname, email, password); 
    return users; 
}

const checkEmail = async (email) => {
    const users = await userService.checkEmail(email); 
    return users; 
}

const checkUsername = async(fullname) => {
    const users = await userService.checkUsername(fullname); 
    return users; 
}

const findOneByEmail = async(email) => {
    const users = await userService.findOneByEmail(email); 
    return users; 
}

const changePass = async(email, newPass) => {
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
    changePass
}