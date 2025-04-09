const cuentasdb = require('../db/cuentasdb'); 

// Obtener todas las cuentas
const getAllCuentas = async () => {
  const cuenta = cuentasdb.getAllCuentas(); 
  return cuenta; 
}

// Obtener cuenta por ID
const getOneCuentaById = async (id) => {
  const cuenta = cuentasdb.getOneCuentaById(id); 
  return cuenta; 
}

// Obtener cuenta por nombre
const getOneCuentaByName = async (nombre) => {
  const cuenta = cuentasdb.getOneCuentaByName(nombre); 
  return cuenta; 
}

// Crear nueva cuenta
const createOneCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) => {
  const cuenta = cuentasdb.createOneCuenta(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero); 
  return cuenta; 
}

// Actualizar cuenta existente
const updateCuenta = async (nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id) => {
  const cuenta = cuentasdb.updateCuenta(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id); 
  return cuenta; 
}

// Eliminar cuenta por ID
const deleteCuenta = async (id) => {
  const cuenta = cuentasdb.deleteCuenta(id); 
  return cuenta; 
}

// Agregar producto a cuenta
const addProdToCuenta = async (nuevoProducto, id) => {
  const cuenta = cuentasdb.addProdToCuenta(nuevoProducto, id); 
  return cuenta; 
}

// Eliminar producto de cuenta
const removeProd = async (prodAEliminar, id) => {
  const cuenta = cuentasdb.removeProd(prodAEliminar, id); 
  return cuenta; 
}

// Obtener cuentas por estado (ej: "activa", "cerrada")
const getByStatus = async (estatus) => {
  const cuenta = cuentasdb.getByStatus(estatus); 
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
}
