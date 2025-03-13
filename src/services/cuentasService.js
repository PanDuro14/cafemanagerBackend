const cuentasdb = require('../db/cuentasdb'); 

const getAllCuentas = async() => {
    const cuenta = cuentasdb.getAllCuentas(); 
    return cuenta; 
}

const getOneCuentaById = async(id) => {
    const cuenta = cuentasdb.getOneCuentaById(id); 
    return cuenta; 
}

const getOneCuentaByName = async(nombre) => {
    const cuenta = cuentasdb.getOneCuentaByName(nombre); 
    return cuenta; 
}

const createOneCuenta = async(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero) => {
    const cuenta = cuentasdb.createOneCuenta( nombre, productos, fecha, precio_total, estado, metodo_pago, mesero); 
    return cuenta; 
}   

const updateCuenta = async( nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id) => {
    const cuenta = cuentasdb.updateCuenta( nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id); 
    return cuenta; 
}

const deleteCuenta = async(id) => {
    const cuenta = cuentasdb.deleteCuenta(id); 
    return cuenta; 
}

const addProdToCuenta = async(nuevoProducto, id) => {
    const cuenta = cuentasdb.addProdToCuenta(nuevoProducto, id); 
    return cuenta; 
}

const removeProd = async(prodAEliminar, id) => {
    const cuenta = cuentasdb.removeProd(prodAEliminar, id); 
    return cuenta; 
}

const getByStatus = async(estatus) => {
    const cuenta = cuentasdb.getByStatus(estatus); 
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
    getByStatus, 
}
