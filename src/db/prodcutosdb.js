const { Pool } = require('pg'); 
const pool = new Pool({
    port: process.env.PORT_DB,    
    host: process.env.HOST_DB,    
    user: process.env.USER_DB,    
    password: process.env.PASSWORD_DB,  
    database: process.env.NAME_DB,
}); 

pool.connect()
    .then(() => console.log('Conexión exitosa con productos '))
    .catch((error) => console.error('Error al conectar con productos ')); 


const getAllProductos = async() => {
    return new Promise((resolve, reject) => {
        const sql = ('select * from productos'); 
        pool.query(sql, (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows); 
        }); 
    }); 
}

const getOneProducto = async(id) => {
    return new Promise((resolve, reject) => {
        const sql = ('Select * from productos where id = $1'); 
        pool.query(sql, [id], (error, results) => {
            if(error){
                return reject(error); 
            }
            resolve(results.rows);
        }); 
    }); 
}

const createProducto = async(nombre, precio, categoria, proveedor, cantidad) => {
    return new Promise((resolve, reject) => {
        const sql = ('Insert into productos (nombre, precio, categoria, proveedor, cantidad) values ($1, $2, $3, $4, $5)'); 
        pool.query(sql, [nombre, precio, categoria, proveedor, cantidad], (error) => {
            if(error){
                return reject(error);
            }
            resolve('Producto añadido'); 
        })
    }); 
}

const updateProducto = async (nombre, precio, categoria, proveedor, cantidad, id) => {
    try {
        const sql = (`
            UPDATE productos SET 
                nombre = COALESCE($1, nombre), 
                precio = COALESCE($2, precio), 
                categoria = COALESCE($3, categoria), 
                proveedor = COALESCE($4, proveedor), 
                cantidad = COALESCE($5, cantidad) 
            WHERE id = $6;`);

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


const deleteProducto = async(id) => {
    return new Promise((resolve, reject) => {
        const sql = ('Delete from productos where id = $1'); 
        pool.query(sql, [id], (error) => {
            if(error){
                return reject(error); 
            }
            resolve(`Producto ${id} eliminado exitosamente`); 
        }); 
    }); 
}


module.exports = {
    getAllProductos, 
    getOneProducto, 
    createProducto, 
    updateProducto, 
    deleteProducto
}