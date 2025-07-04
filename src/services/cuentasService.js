const cuentasdb = require('../db/cuentasdb'); 

// Obtener todas las cuentas
const getAllCuentas = async () => {
  const cuenta = await cuentasdb.getAllCuentas(); 
  return cuenta; 
}

// Obtener cuenta por ID
const getOneCuentaById = async (id) => {
  const cuenta = await cuentasdb.getOneCuentaById(id); 
  return cuenta; 
}

// Obtener cuenta por nombre
const getOneCuentaByName = async (nombre) => {
  const cuenta = await cuentasdb.getOneCuentaByName(nombre); 
  return cuenta; 
}

// Crear nueva cuenta
const createOneCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) => {
  const cuenta = await cuentasdb.createOneCuenta(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero); 
  return cuenta; 
}

// Actualizar cuenta existente
const updateCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id) => {
  const cuenta = await cuentasdb.updateCuenta(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id); 
  return cuenta; 
}

// Eliminar cuenta por ID
const deleteCuenta = async (id) => {
  const cuenta = await cuentasdb.deleteCuenta(id); 
  return cuenta; 
}

// Agregar producto a cuenta
const addProdToCuenta = async (nuevoProducto, id) => {
  const cuenta = await cuentasdb.addProdToCuenta(nuevoProducto, id); 
  return cuenta; 
}

// Eliminar producto de cuenta
const removeProd = async (prodAEliminar, id) => {
  const cuenta = await cuentasdb.removeProd(prodAEliminar, id); 
  return cuenta; 
}

// Actializar un producto de la cuenta 
const updateProduct = async (updatedProd, id) => {
  const cuenta = await cuentasdb.updateProduct(updatedProd, id); 
  return cuenta; 
}

// Actualizar precio total 
const updateTotal = async(nuevoPrecio, id) => {
  const cuenta = await cuentasdb.updateTotal(nuevoPrecio, id); 
  return cuenta; 
}

// Actualizar estado 
const updateEstado = async(nuevoEstado, id) => {
  const cuenta = await cuentasdb.updateEstado(nuevoEstado, id); 
  return cuenta; 
}

// Actualizar metodo de pago
const updateMetodoPago = async(nuevoMetodo, id) => {
  const cuenta = await cuentasdb.updateMetodoPago(nuevoMetodo, id); 
  return cuenta; 
}

const getOneProduct = async (cuentaId, menuId) => {
  const cuenta = await cuentasdb.getOneProduct(cuentaId, menuId); 
  return cuenta; 
}

const getOnlyOneProduct = async (cuentaId, menuId, tamano) => {
  const cuenta = await cuentasdb.getOnlyOneProduct(cuentaId, menuId, tamano); 
  return cuenta; 
}

// Obtener cuentas por estado (ej: "activa", "cerrada")
const getByStatus = async (estatus) => {
  const cuenta = await cuentasdb.getByStatus(estatus); 
  return cuenta; 
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
  getByStatus, 
  getOneProduct,
  getOnlyOneProduct, 
  updateTotal, 
  updateProduct, 
  updateEstado,
  updateMetodoPago,
}
