const dbConnection = require('./dbConection'); 
const dbLocal = require('./dbConectionLocal'); 

let pool; 

(async () => {
  try {
    await dbConnection.connect(); 
    console.log('Conexión con la db remota exitosa: Cuentas'); 
    pool = dbConnection; 
  } catch (errRemota){
    console.warn('Error con la db remota. Intentando conexión local... ', errRemota.message); 

    try {
      await dbLocal.connect(); 
      console.log('Conexión con la db local exitosa: Cuentas'); 
      pool = dbLocal; 
    } catch (errLocal){
      console.error('Error al conectar con la db local: ', errLocal.message); 
    }
  }
})(); 


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
    // Extraer los valores del producto a eliminar
    const { id: prodId, tamano, nombre } = prodAEliminar[0];
    console.log('Eliminar producto: ', prodAEliminar);

    const sql = `
      UPDATE cuentas
      SET productos = array(
        SELECT producto
        FROM unnest(productos) AS producto
        WHERE NOT (
          -- Convertimos la cadena JSON a JSONB para poder acceder a las propiedades
          (producto::jsonb)->>'id' = $1 AND
          (producto::jsonb)->>'tamano' = $2 AND
          (producto::jsonb)->>'nombre' = $3
        )
      )
      WHERE id = $4
      RETURNING productos;  -- Devuelve el arreglo actualizado de productos
    `;

    pool.query(sql, [prodId, tamano, nombre, id], (error, results) => {
      if (error) {
        console.error('Error en la consulta SQL:', error); 
        return reject(error);
      }

      // Verificar si los productos se actualizaron
      if (results.rowCount > 0) {
        console.log('Productos después de la eliminación: ', results.rows[0].productos);
        resolve(results.rows[0].productos); // Retorna el arreglo actualizado de productos
      } else {
        console.log('No se encontraron productos para eliminar');
        resolve(null); // Si no se eliminaron productos
      }
    });
  });
};

const updateProduct = async (updatedProd, id) => {
  return new Promise((resolve, reject) => { 
    const { id: prodId, tamano, cantidad } = updatedProd[0]; 
    console.log('Prod a actualizar: ', updatedProd);

    const sql = `
      UPDATE cuentas
      SET productos = array(
        SELECT 
          CASE
            WHEN (producto::jsonb)->>'id' = $1 AND 
                 (producto::jsonb)->>'tamano' = $2  -- Comprobamos id y tamano como texto
            THEN 
              jsonb_set(producto::jsonb, '{cantidad}', to_jsonb($3::numeric))  -- Convertimos cantidad a jsonb
            ELSE producto::jsonb  -- Mantenemos el producto sin cambios si no coincide
          END
        FROM unnest(productos) AS producto
      )
      WHERE id = $4
      RETURNING productos;
    `;

    pool.query(sql, [prodId, tamano, cantidad, id], (error, results) => {
      if (error) {
        return reject(error);  // Si hay error, lo rechazamos
      }

      // Verificar si se actualizó el producto
      if (results.rowCount > 0) {
        resolve(results.rows[0].productos); // Devolver los productos actualizados
      } else {
        resolve(null); // No se encontró ninguna fila para actualizar
      }
    });
  });
};

// Actualizar precio total 
const updateTotal = async (nuevoPrecio, id) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cuentas SET precio_total = $1 WHERE id = $2`; 
    pool.query(sql, [nuevoPrecio, id], (error, result) => {
      if(error) reject(error); 
      resolve('Precio actualizado '); 
    }); 
  }); 
}

// Actualizar estado
const updateEstado = async(nuevoEstado, id) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cuentas SET estado = $1 WHERE id = $2`; 
    pool.query(sql, [nuevoEstado, id], (error, result) => {
      if(error) reject(error) ; 
      resolve('Estado actualizado'); 
    }); 
  }); 
}

// Actualizar metodo de pago
const updateMetodoPago = async(nuevoMetodo, id) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cuentas SET metodo_pago = $1 WHERE id = $2`;
    pool.query(sql, [nuevoMetodo, id], (error, result) => {
      if(error) reject(error) ; 
      resolve('Metodo de pago actualizado'); 
    }); 
  }); 
}


const getOneProduct = async (cuentaId, menuId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT c.productos, m.id
      FROM cuentas c, menu m
      WHERE c.id = $1 AND m.id = $2;
    `; 
    pool.query(sql, [cuentaId, menuId], (error, results) => {
      if(error) return reject(error); 
      resolve(results.rows ); 
    }); 
  }); 
}


const getOnlyOneProduct = async (req, res) => {
  try {
    const { cuentasId, menuId } = req.params;
    const { tamano } = req.body;

    if (!cuentasId || !menuId || !tamano) {
      return res.status(400).json({ error: 'Faltan parámetros necesarios' });
    }

    const query = `
      SELECT 
        (SELECT productos FROM cuentas WHERE id = $1) AS productos,
        m.id AS menu_id, p.id AS precio_id, p.tamano
      FROM menu m
      JOIN menu_precios p ON m.id = p.menu_id
      WHERE m.id = $2 AND p.tamano = $3
      LIMIT 1;
    `;

    const result = await pool.query(query, [cuentasId, menuId, tamano]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const producto = result.rows[0];
    res.status(200).json({ message: 'Producto encontrado', cuenta: producto });

  } catch (error) {
    console.error('Error al obtener el contenido de la cuenta:', error);
    res.status(502).json({ error: 'Error al obtener el contenido de la cuenta' });
  }
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
  getByStatus, 
  getOneProduct,
  getOnlyOneProduct, 
  updateTotal,
  updateProduct,
  updateEstado,
  updateMetodoPago,
};
