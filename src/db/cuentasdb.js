const { Pool } = require('pg');

// Configuración de conexión
const poolLocal = new Pool({
  port: process.env.PORT_DB,
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.NAME_DB,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
}); 

try {
  // Intentamos conectar con la base de datos del servidor
  pool.connect()
    .then((res) => {
      console.log('Conexión prod exitosa con cuentas');
    })
    .catch((error) => {
      console.error('Error al conectar con cuentas en el servidor. Intentando conexión local...');
      poolLocal.connect()
        .then(() => console.log('Conexión local exitosa con cuentas'))
        .catch((message) => console.log('Error al conectar con la base de datos local'));
    });
} catch (error) {
  // Este bloque se ejecutará si hay errores en el intento de conexión (aunque lo hemos capturado en el .catch)
  console.error('Error general al intentar conectar a las bases de datos');
}

// Obtener todas las cuentas
const getAllCuentas = async () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cuentas';
    pool.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Obtener una cuenta por ID
const getOneCuentaById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cuentas WHERE id = $1';
    pool.query(sql, [id], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Obtener cuenta por nombre
const getOneCuentaByName = async (nombre) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cuentas WHERE nombre = $1';
    pool.query(sql, [nombre], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Crear una nueva cuenta
const createOneCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO cuentas 
        (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    pool.query(sql, [nombre, productos, fecha, precio_total, estado, metodo_pago, mesero], (error) => {
      if (error) return reject(error);
      resolve('Cuenta añadida');
    });
  });
};

// Actualizar una cuenta por ID (usa COALESCE para actualizar parcialmente)
const updateCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE cuentas SET 
        nombre = COALESCE($1, nombre),
        productos = COALESCE($2, productos),
        fecha = COALESCE($3, fecha),
        precio_total = COALESCE($4, precio_total),
        estado = COALESCE($5, estado),
        metodo_pago = COALESCE($6, metodo_pago),
        mesero = COALESCE($7, mesero)
      WHERE id = $8 RETURNING *
    `;
    pool.query(sql, [nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.rowCount > 0 ? result.rows[0] : null);
    });
  });
};

// Eliminar cuenta por ID
const deleteCuenta = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM cuentas WHERE id = $1';
    pool.query(sql, [id], (error, result) => {
      if (error) return reject(error);
      resolve(result.rowCount > 0 ? `Cuenta con ID ${id} eliminada correctamente` : 'Cuenta no encontrada');
    });
  });
};

// Agregar un producto al array de productos de una cuenta
const addProdToCuenta = async (nuevoProducto, id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE cuentas 
      SET productos = array_append(productos, $1)
      WHERE id = $2 RETURNING *
    `;
    pool.query(sql, [JSON.stringify(nuevoProducto), id], (error, results) => {
      if (error) return reject(error);
      resolve(results.rowCount > 0 ? results.rows[0] : null);
    });
  });
};

// Eliminar un producto del array de productos de una cuenta
const removeProd = async (prodAEliminar, id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE cuentas 
      SET productos = array_remove(productos, $1)
      WHERE id = $2 RETURNING *
    `;
    pool.query(sql, [JSON.stringify(prodAEliminar), id], (error, results) => {
      if (error) return reject(error);
      resolve(results.rowCount > 0 ? results.rows[0] : null);
    });
  });
};

// Filtrar cuentas por estado
const getByStatus = async (estado) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cuentas WHERE estado = $1';
    pool.query(sql, [estado], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

module.exports = {
  getAllCuentas,
  getOneCuentaById,
  getOneCuentaByName,
  createOneCuenta,
  updateCuenta,
  deleteCuenta,
  addProdToCuenta,
  removeProd,
  getByStatus
};
