const { Pool } = require('pg'); 
const pool = new Pool({
    port: process.env.PORT_DB,    
    host: process.env.HOST_DB,    
    user: process.env.USER_DB,    
    password: process.env.PASSWORD_DB,  
    database: process.env.NAME_DB,
}); 

pool.connect()
    .then(() => console.log('Conexión exitosa con menu '))
    .catch((error) => console.error('Error al conectar con menu ')); 



// Obtener todos los productos con sus tamaños y precios
const getAllMenuItems = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT m.id, m.nombre, m.descripcion, m.categoria, 
                   encode(m.imagen, 'base64') AS imagen, 
                   p.tamano, p.precio
            FROM menu m
            LEFT JOIN menu_precios p ON m.id = p.menu_id
            ORDER BY m.id, p.precio;
        `;
        pool.query(sql, (error, results) => {
            if (error) {
                console.error('Error en getAllMenuItems:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
};


// Obtener un producto por ID con sus tamaños y precios
const getMenuItemById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT m.id, m.nombre, m.descripcion, m.categoria, 
                   encode(m.imagen, 'base64') AS imagen, 
                   p.tamano, p.precio
            FROM menu m
            LEFT JOIN menu_precios p ON m.id = p.menu_id
            WHERE m.id = $1
            ORDER BY p.precio;
        `;
        pool.query(sql, [id], (error, results) => {
            if (error) {
                console.error('Error en getMenuItemById:', error);
                return reject(error);
            }
            if (results.rows.length === 0) {
                return reject('Producto no encontrado');
            }
            resolve(results.rows);
        });
    });
};


// Crear un nuevo producto con sus tamaños y precios
const createMenuItem = async (nombre, descripcion, categoria, imagenBuffer, tamanosPrecios) => {
    return new Promise((resolve, reject) => {
        pool.connect(async (err, client, done) => {
            if (err) {
                console.error('Error en createMenuItem - Conexión:', err);
                return reject('Error al conectar con la base de datos');
            }

            try {
                await client.query('BEGIN');

                // Insertar en la tabla menu
                const sqlMenu = `
                    INSERT INTO menu (nombre, descripcion, categoria, imagen) 
                    VALUES ($1, $2, $3, $4) RETURNING id;
                `;
                const menuResult = await client.query(sqlMenu, [nombre, descripcion, categoria, imagenBuffer]);
                const menuId = menuResult.rows[0].id;

                // Insertar en la tabla menu_precios
                const sqlPrecios = `
                    INSERT INTO menu_precios (menu_id, tamano, precio) VALUES ($1, $2, $3);
                `;
                for (const { tamano, precio } of tamanosPrecios) {
                    await client.query(sqlPrecios, [menuId, tamano, precio]);
                }

                await client.query('COMMIT');
                resolve({ id: menuId, nombre, descripcion, categoria, tamanosPrecios });
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error en createMenuItem - Transacción:', error);
                reject('Error al insertar el producto: ' + error);
            } finally {
                done();
            }
        });
    });
};


// Actualizar un producto con sus tamaños y precios
const updateMenuItem = async (id, nombre, descripcion, categoria, imagenBuffer, tamanosPrecios) => {
    return new Promise((resolve, reject) => {
        pool.connect(async (err, client, done) => {
            if (err) {
                console.error('Error en updateMenuItem - Conexión:', err);
                return reject('Error al conectar con la base de datos');
            }

            try {
                await client.query('BEGIN');

                // Actualizar la información del producto
                const sqlUpdateMenu = `
                    UPDATE menu 
                    SET nombre = $1, descripcion = $2, categoria = $3, imagen = $4 
                    WHERE id = $5;
                `;
                await client.query(sqlUpdateMenu, [nombre, descripcion, categoria, imagenBuffer, id]);

                // Eliminar precios previos y agregar los nuevos
                await client.query('DELETE FROM menu_precios WHERE menu_id = $1;', [id]);

                const sqlPrecios = `
                    INSERT INTO menu_precios (menu_id, tamano, precio) VALUES ($1, $2, $3);
                `;
                for (const { tamano, precio } of tamanosPrecios) {
                    await client.query(sqlPrecios, [id, tamano, precio]);
                }

                await client.query('COMMIT');
                resolve({ id, nombre, descripcion, categoria, tamanosPrecios });
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error en updateMenuItem - Transacción:', error);
                reject('Error al actualizar el producto: ' + error);
            } finally {
                done();
            }
        });
    });
};


// Eliminar un producto
const deleteMenuItem = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM menu WHERE id = $1 RETURNING id', [id], (error, results) => {
            if (error) {
                console.error('Error en deleteMenuItem:', error);
                return reject('Error al eliminar el producto: ' + error);
            }
            if (results.rowCount === 0) {
                return reject('Producto no encontrado');
            }
            resolve({ message: 'Producto eliminado correctamente' });
        });
    });
};


// Menu sin imagenes 
const getAllMenuItemsWithoutImages = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT m.id, m.nombre, m.descripcion, m.categoria,  
                   p.tamano, p.precio
            FROM menu m
            LEFT JOIN menu_precios p ON m.id = p.menu_id
            ORDER BY m.id, p.precio;
        `;
        pool.query(sql, (error, results) => {
            if (error) {
                console.error('Error en getAllMenuItems:', error);
                return reject(error);
            }
            resolve(results.rows);
        });
    });
};

module.exports = {
    getAllMenuItems, 
    getMenuItemById, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    getAllMenuItemsWithoutImages
};
