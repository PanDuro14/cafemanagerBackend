const { Pool } = require('pg'); 
const pool = new Pool({
    port: process.env.PORT_DB,    
    host: process.env.HOST_DB,    
    user: process.env.USER_DB,    
    password: process.env.PASSWORD_DB,  
    database: process.env.NAME_DB,
}); 

pool.connect()
    .then(() => console.log('Conexión exitosa con cuentas'))
    .catch((error) => console.error('Error al conectar con cuentas ')); 


const getAllCuentas = async() => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from cuentas'); 
        pool.query(sql, (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows); 
        }); 
    });     
}

const getOneCuentaById = async(id) => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from cuentas where id = $1'); 
        pool.query(sql, [id], (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows); 
        }); 
    }); 
}

const getOneCuentaByName = async(nombre) => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from cuentas where nombre = $1'); 
        pool.query(sql, [nombre], (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows); 
        }); 
    }); 
}   

const createOneCuenta = async(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) => {
    return new Promise((resolve, reject) => {
        const sql = (`Insert into cuentas 
            (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) 
            values ($1, $2, $3, $4, $5, $6, $7)`); 
        pool.query(sql, [nombre, productos, fecha, precio_total, estado, metodo_pago, mesero], (error) => {
            if(error){
                return reject(error); 
            }
            resolve('Cuenta añadida'); 
        }); 
    }); 
}

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
            WHERE id = $8 RETURNING *;
        `;

        pool.query(sql, [nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result.rowCount > 0 ? result.rows[0] : null);
        });
    });
};



const deleteCuenta = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM cuentas WHERE id = $1';
        pool.query(sql, [id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result.rowCount > 0 ? `Cuenta con ID ${id} eliminada correctamente` : 'Cuenta no encontrada');
        });
    });
};

// añadir productos a la cuenta 
const addProdToCuenta = async (nuevoProducto, id) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE cuentas 
                     SET productos = array_append(productos, $1) 
                     WHERE id = $2 RETURNING *;`;

        pool.query(sql, [JSON.stringify(nuevoProducto), id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rowCount > 0 ? results.rows[0] : null);

        });
    });
};


const removeProd = async (prodAEliminar, id) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE cuentas 
                     SET productos = array_remove(productos, $1) 
                     WHERE id = $2 RETURNING *;`;

        pool.query(sql, [JSON.stringify(prodAEliminar), id], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rowCount > 0 ? results.rows[0] : null);
        });
    });
};

const getByStatus = async (estado) => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from cuentas where estado = $1'); 
        pool.query(sql, [estado], (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows); 
        })
    }); 
}

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
}