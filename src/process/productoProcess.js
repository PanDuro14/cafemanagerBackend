const productoService = require('../services/productosServices');  

const getAllProductos = async() => {
    const productos = productoService.getAllProductos(); 
    return productos; 
}   

const getOneProducto = async(id) => {
    const productos = productoService.getOneProducto(id); 
    return productos; 
}

const createProducto = async(nombre, precio, categoria, proveedor, cantidad) => {
    const productos = productoService.createProducto(nombre, precio, categoria, proveedor, cantidad); 
    return productos
}

const updateProducto = async(nombre, precio, categoria, proveedor, cantidad, id) => {
    const productos = productoService.updateProducto(nombre, precio, categoria, proveedor, cantidad, id); 
    return productos; 
}

const deleteProducto = async(id) => {
    const productos = productoService.deleteProducto(id); 
    return productos; 
}

module.exports = {
    getAllProductos, 
    getOneProducto, 
    createProducto, 
    updateProducto,
    deleteProducto
}