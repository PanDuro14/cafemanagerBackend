const cuentaService = require('../services/cuentasService'); 

const getAllCuentas = async() => {
    const cuenta = cuentaService.getAllCuentas(); 
    return cuenta; 
}

const getOneCuentaById = async(id) => {
    const cuenta = cuentaService.getOneCuentaById(id); 
    return cuenta; 
}

const getOneCuentaByName = async(nombre) => {
    const cuenta = cuentaService.getOneCuentaByName(nombre); 
    return cuenta; 
}

const createOneCuenta = async(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) => {
    const cuenta = cuentaService.createOneCuenta( nombre, productos, fecha, precio_total, estado, metodo_pago, mesero); 
    return cuenta; 
}   

const updateCuenta = async( nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id) => {
    const cuenta = cuentaService.updateCuenta( nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id); 
    return cuenta; 
}

const deleteCuenta = async(id) => {
    const cuenta = cuentaService.deleteCuenta(id); 
    return cuenta; 
}

const addProdToCuenta = async(nuevoProducto, id) => {
    const cuenta = cuentaService.addProdToCuenta(nuevoProducto, id); 
    return cuenta; 
}

const removeProd = async(prodAEliminar, id) => {
    const cuenta = cuentaService.removeProd(prodAEliminar, id); 
    return cuenta; 
}

const getByStatus = async(estatus) => {
    const cuenta = cuentaService.getByStatus(estatus); 
    return cuenta; 
}

module.exports ={
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
