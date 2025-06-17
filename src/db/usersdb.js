const bcrypt = require('bcryptjs'); 
const { Pool } = require('pg');

// Configuración de conexión local
const pool = new Pool({
  port: process.env.PORT_DB,
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.NAME_DB,
});

try {
  // Intentamos conectar con la base de datos local
  pool.connect()
    .then(() => {
      console.log('Conexión local exitosa con usuarios');
    })
    .catch((error) => {
      console.error('Error al conectar con la base de datos local:', error);
    });
} catch (error) {
  // Este bloque captura cualquier error general
  console.error('Error general al intentar conectar con la base de datos local:', error);
}


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
