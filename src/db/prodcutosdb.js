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
      console.log('Conexión local exitosa conn productos');
    })
    .catch((error) => {
      console.error('Error al conectar con la base de datos local:', error);
    });
} catch (error) {
  // Este bloque captura cualquier error general
  console.error('Error general al intentar conectar con la base de datos local:', error);
}
// Obtener todos los productos
const getAllProductos = async () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM productos';
    pool.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Obtener un producto por ID
const getOneProducto = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM productos WHERE id = $1';
    pool.query(sql, [id], (error, results) => {
      if (error) return reject(error);
      resolve(results.rows);
    });
  });
};

// Crear un nuevo producto
const createProducto = async (nombre, precio, categoria, proveedor, cantidad) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO productos (nombre, precio, categoria, proveedor, cantidad) VALUES ($1, $2, $3, $4, $5)';
    pool.query(sql, [nombre, precio, categoria, proveedor, cantidad], (error) => {
      if (error) return reject(error);
      resolve('Producto añadido');
    });
  });
};

// Actualizar un producto (parcial o completo)
const updateProducto = async (nombre, precio, categoria, proveedor, cantidad, id) => {
  try {
    const sql = `
      UPDATE productos SET 
        nombre = COALESCE($1, nombre),
        precio = COALESCE($2, precio),
        categoria = COALESCE($3, categoria),
        proveedor = COALESCE($4, proveedor),
        cantidad = COALESCE($5, cantidad)
      WHERE id = $6;
    `;

    const values = [
      nombre ?? null,
      precio ?? null,
      categoria ?? null,
      proveedor ?? null,
      cantidad ?? null,
      id
    ];

    const result = await pool.query(sql, values);
    return result.rowCount > 0 ? 'Producto actualizado correctamente' : 'Producto no encontrado';
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw new Error('Hubo un problema al actualizar el producto');
  }
};

// Eliminar producto por ID
const deleteProducto = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM productos WHERE id = $1';
    pool.query(sql, [id], (error) => {
      if (error) return reject(error);
      resolve(`Producto ${id} eliminado exitosamente`);
    });
  });
};

module.exports = {
  getAllProductos,
  getOneProducto,
  createProducto,
  updateProducto,
  deleteProducto
};
