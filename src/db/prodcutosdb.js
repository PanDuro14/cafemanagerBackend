const dbConnection = require('./dbConection'); 
const dbLocal = require('./dbConectionLocal'); 

let pool; 

(async () => {
  try {
    await dbConnection.connect(); 
    console.log('Conexión con la db remota exitosa: Productos'); 
    pool = dbConnection; 
  } catch (errRemota){
    console.warn('Error con la db remota. Intentando conexión local... ', errRemota.message); 

    try {
      await dbLocal.connect(); 
      console.log('Conexión con la db local exitosa: Productos'); 
      pool = dbLocal; 
    } catch (errLocal){
      console.error('Error al conectar con la db local: ', errLocal.message); 
    }
  }
})(); 



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
