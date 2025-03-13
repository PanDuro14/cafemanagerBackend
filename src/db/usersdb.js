const { Pool } = require('pg'); 
const bcrypt = require('bcryptjs'); 

const pool = new Pool({
    port: process.env.PORT_DB,    
    host: process.env.HOST_DB,    
    user: process.env.USER_DB,    
    password: process.env.PASSWORD_DB,  
    database: process.env.NAME_DB,
}); 

pool.connect()
    .then(() => console.log('Conexión exitosa con usuario '))
    .catch((error) => console.error('Error al conectar con usuario ')); 

// Login 
const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        // Buscamos el usuario solo por su email
        const sql = 'SELECT * FROM users WHERE email = $1';
        pool.query(sql, [email], async (error, results) => {
            if (error) {
                return reject(error); 
            }

            // Verificamos si el usuario existe
            if (results.rows.length === 0) {
                return reject('Error: Usuario no encontrado'); 
            }

            const user = results.rows[0]; // El primer usuario que coincide con el email

            console.log('Conraseña proporcionada: ', password); 
            console.log('Contraseña encriptada', user.password); 

            // Comparamos la contraseña encriptada con la proporcionada
            const isMatch = await bcrypt.compare(password, user.password); 
            console.log('¿Las contraseñas coinciden?', isMatch); 

            if (isMatch) {
                resolve(user);  // Si la contraseña es correcta, devolvemos el usuario
            } else {
                reject('Contraseña incorrecta');  // Si la contraseña no coincide
            }
        }); 
    }); 
};


const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from users '); 
        pool.query(sql, (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows); 
        }); 
    }); 
}   

const getOneUser = async(id) => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from users where id = $1'); 
        pool.query(sql, [id], (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows);
        }); 
    }); 
}

const createUser = async (fullname, email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcrypt.genSalt(10); 
            const hashedPassword = await bcrypt.hash(password, salt); 

            const sql = ('Insert into users (fullname, email, password) values ($1, $2, $3)'); 
            pool.query(sql, [fullname, email, hashedPassword], (error) => {
                if(error){
                    return reject(error); 
                }
                resolve('Usuario agregado'); 
            });
        } catch (error){
            reject(error); 
        }
    }); 
}

const checkEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from users where email = $1'); 
        pool.query(sql, [email], (error, results) => {
            if(error){
                return reject(error);
            }
            resolve(results.rows); 
        }); 
    }); 
}


const checkUsername = async(fullname) => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from users where fullname = $1'); 
        pool.query(sql, [fullname], (error, results) => {
            if(error){
                return reject(error); 
            }
        }); 
        resolve(results.rows);
    }); 
}

const findOneByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = $1';
        pool.query(sql, [email], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows.length > 0 ? results.rows[0] : null); 
        });
    });
};
// Propiedad de Jesús Morales 

const changePass = async (email, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Generar el hash de la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const sql = "UPDATE users SET password = $1 WHERE email = $2 RETURNING *";

            // Ejecutar la consulta en la base de datos
            pool.query(sql, [hashedPassword, email], (error, results) => {
                if (error) {
                    return reject(error);
                }
                if (results.rowCount === 0) {
                    return reject("Usuario no encontrado");
                }
                resolve("Contraseña actualizada correctamente");
            });
        } catch (error) {
            reject(error);
        }
    });
};

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