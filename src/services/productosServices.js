const productosdb = require('../db/prodcutosdb'); 

const getAllProductos = async() => {
    const productos = productosdb.getAllProductos(); 
    return productos; 
}   

const getOneProducto = async(id) => {
    const productos = productosdb.getOneProducto(id); 
    return productos; 
}

const createProducto = async(nombre, precio, categoria, proveedor, cantidad) => {
    const productos = productosdb.createProducto(nombre, precio, categoria, proveedor, cantidad); 
    return productos
}

const updateProducto = async(nombre, precio, categoria, proveedor, cantidad, id) => {
    const productos = productosdb.updateProducto(nombre, precio, categoria, proveedor, cantidad, id); 
    return productos; 
}

const deleteProducto = async(id) => {
    const productos = productosdb.deleteProducto(id); 
    return productos; 
}

module.exports = {
    getAllProductos, 
    getOneProducto, 
    createProducto, 
    updateProducto,
    deleteProducto
}