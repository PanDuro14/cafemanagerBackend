const productoService = require('../services/productosServices');  

// Obtener todos los productos
const getAllProductos = async () => {
  const productos = productoService.getAllProductos(); 
  return productos; 
}

// Obtener producto por ID
const getOneProducto = async (id) => {
  const productos = productoService.getOneProducto(id); 
  return productos; 
}

// Crear nuevo producto
const createProducto = async (nombre, precio, categoria, proveedor, cantidad) => {
  const productos = productoService.createProducto(nombre, precio, categoria, proveedor, cantidad); 
  return productos;
}

// Actualizar producto por ID
const updateProducto = async (nombre, precio, categoria, proveedor, cantidad, id) => {
  const productos = productoService.updateProducto(nombre, precio, categoria, proveedor, cantidad, id); 
  return productos; 
}

// Eliminar producto por ID
const deleteProducto = async (id) => {
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
