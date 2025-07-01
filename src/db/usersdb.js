const bcrypt = require('bcryptjs'); 
const dbConnection = require('./dbConection'); 
const dbLocal = require('./dbConectionLocal'); 

let pool; 

(async () => {
  try {
    await dbConnection.connect(); 
    console.log('Conexión con la db remota exitosa: Usuarios'); 
    pool = dbConnection; 
  } catch (errRemota){
    console.warn('Error con la db remota. Intentando conexión local... ', errRemota.message); 

    try {
      await dbLocal.connect(); 
      console.log('Conexión con la db local exitosa: Usuarios'); 
      pool = dbLocal; 
    } catch (errLocal){
      console.error('Error al conectar con la db local: ', errLocal.message); 
    }
  }
})(); 




// Login de usuario: valida email y contraseña
const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    pool.query(sql, [email], async (error, results) => {
      if (error) return reject(error);
      if (results.rows.length === 0) return reject('Error: Usuario no encontrado');

      const user = results.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      isMatch ? resolve(user) : reject('Contraseña incorrecta');
    });
  });
};

// Obtener todos los usuarios
const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    pool.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Obtener usuario por ID
const getOneUser = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = $1';
    pool.query(sql, [id], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Crear nuevo usuario con contraseña cifrada
const createUser = async (fullname, email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const sql = 'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3)';
      pool.query(sql, [fullname, email, hashedPassword], (error) => {
        if (error) return reject(error);
        resolve('Usuario agregado');
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Verificar si un email ya está registrado
const checkEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    pool.query(sql, [email], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Verificar si el nombre de usuario ya existe
const checkUsername = async (fullname) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE fullname = $1';
    pool.query(sql, [fullname], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Buscar usuario por email y devolver uno solo
const findOneByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = $1';
    pool.query(sql, [email], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows.length > 0 ? results.rows[0] : null);
    });
  });
};

// Cambiar contraseña de un usuario (con hash)
const changePass = async (email, newPassword) => {
  return new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const sql = "UPDATE users SET password = $1 WHERE email = $2 RETURNING *";
      pool.query(sql, [hashedPassword, email], (error, results) => {
        if (error) return reject(error);
        if (results.rowCount === 0) return reject("Usuario no encontrado");
        resolve("Contraseña actualizada correctamente");
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Propiedad de Jesús Morales
module.exports = {
  login,
  getAllUsers,
  getOneUser,
  createUser,
  checkEmail,
  checkUsername,
  findOneByEmail,
  changePass,
};
