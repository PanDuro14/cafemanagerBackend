const cuentaService = require('../services/cuentasService'); 

// Obtener todas las cuentas
const getAllCuentas = async () => {
  const cuenta = cuentaService.getAllCuentas(); 
  return cuenta; 
}

// Obtener cuenta por ID
const getOneCuentaById = async (id) => {
  const cuenta = cuentaService.getOneCuentaById(id); 
  return cuenta; 
}

// Obtener cuenta por nombre
const getOneCuentaByName = async (nombre) => {
  const cuenta = cuentaService.getOneCuentaByName(nombre); 
  return cuenta; 
}

// Crear una nueva cuenta
const createOneCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) => {
  const cuenta = cuentaService.createOneCuenta(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero); 
  return cuenta; 
}

// Actualizar cuenta existente
const updateCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id) => {
  const cuenta = cuentaService.updateCuenta(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id); 
  return cuenta; 
}

// Eliminar cuenta por ID
const deleteCuenta = async (id) => {
  const cuenta = cuentaService.deleteCuenta(id); 
  return cuenta; 
}

// Agregar producto a cuenta
const addProdToCuenta = async (nuevoProducto, id) => {
  const cuenta = cuentaService.addProdToCuenta(nuevoProducto, id); 
  return cuenta; 
}

// Eliminar producto de una cuenta
const removeProd = async (prodAEliminar, id) => {
  const cuenta = cuentaService.removeProd(prodAEliminar, id); 
  return cuenta; 
}

// Obtener cuentas por estado (ej. activa, pagada, cancelada)
const getByStatus = async (estatus) => {
  const cuenta = cuentaService.getByStatus(estatus); 
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
  getByStatus
}
