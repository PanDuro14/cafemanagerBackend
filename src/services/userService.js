const userDB = require('../db/usersdb'); 

const login = async(email, password) => {
    const users = await userDB.login(email, password); 
    return users; 
}
// Propiedad de Jesús Morales 
const getAllUsers = async() => {
    const users = await userDB.getAllUsers(); 
    return users; 
}

const getOneUser = async(id) => {
    const users = await userDB.getOneUser(id); 
    return users; 
}

const createUser = async(fullname, email, password) => {
    const users = await userDB.createUser(fullname, email, password); 
    return users; 
}

const checkEmail = async (email) => {
    const users = await userDB.checkEmail(email); 
    return users; 
}

const checkUsername = async(fullname) => {
    const users = await userDB.checkUsername(fullname); 
    return users; 
}

const findOneByEmail = async(email) => {
    const users = await userDB.findOneByEmail(email); 
    return users; 
}

const changePass = async(email, newPass) => {
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
    changePass
}