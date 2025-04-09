const productosdb = require('../db/prodcutosdb'); 

// Obtener todos los productos
const getAllProductos = async () => {
  const productos = productosdb.getAllProductos(); 
  return productos; 
}

// Obtener un producto por ID
const getOneProducto = async (id) => {
  const productos = productosdb.getOneProducto(id); 
  return productos; 
}

// Crear nuevo producto
const createProducto = async (nombre, precio, categoria, proveedor, cantidad) => {
  const productos = productosdb.createProducto(nombre, precio, categoria, proveedor, cantidad); 
  return productos;
}

// Actualizar producto existente
const updateProducto = async (nombre, precio, categoria, proveedor, cantidad, id) => {
  const productos = productosdb.updateProducto(nombre, precio, categoria, proveedor, cantidad, id); 
  return productos; 
}

// Eliminar producto por ID
const deleteProducto = async (id) => {
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
