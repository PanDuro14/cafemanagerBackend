const cuentasProcess = require('../process/cuentaProcess'); 

// Obtener todas las cuentas
const getAllCuentas = async (req, res) => {
  try {
    const cuentas = await cuentasProcess.getAllCuentas(); 
    res.status(200).json(cuentas); 
  } catch (error) {
    console.error('Error en getAllCuentas:', error); 
    res.status(500).json({ error: 'Error al obtener las cuentas' });
  }
};

// Obtener cuenta por ID
const getOneCuentaById = async (req, res) => {
  try {
    const { id } = req.params; 
    const cuenta = await cuentasProcess.getOneCuentaById(id);
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.status(200).json(cuenta); 
  } catch (error) {
    console.error('Error en getOneCuentaById:', error); 
    res.status(500).json({ error: 'Error al obtener la cuenta' });
  }
};

// Obtener cuenta por nombre
const getOneCuentaByName = async (req, res) => {
  try {
    const { nombre } = req.params; 
    const cuenta = await cuentasProcess.getOneCuentaByName(nombre);
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.status(200).json(cuenta); 
  } catch (error) {
    console.error('Error en getOneCuentaByName:', error); 
    res.status(500).json({ error: 'Error al obtener la cuenta' });
  }
};

// Crear nueva cuenta
const createOneCuenta = async (req, res) => {
  try {
    const { nombre, productos, fecha, precio_total, estado, metodo_pago, mesero } = req.body; 
    if (!nombre || !productos || !fecha || !precio_total || !estado || !metodo_pago || !mesero) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const productosArray = productos.map(p => JSON.stringify(p));
    const nuevaCuenta = await cuentasProcess.createOneCuenta(nombre, productosArray, fecha, precio_total, estado, metodo_pago, mesero); 
    res.status(201).json(nuevaCuenta); 
  } catch (error) {
    console.error('Error en createOneCuenta:', error); 
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
};

// Actualizar cuenta por ID
const updateCuenta = async (req, res) => {
  try {
    const { id } = req.params; 
    const { nombre, productos, fecha, precio_total, estado, metodo_pago, mesero } = req.body; 
    const cuentaActualizada = await cuentasProcess.updateCuenta(nombre, productos, fecha, precio_total, estado, metodo_pago, mesero, id); 
    if (!cuentaActualizada) return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.status(200).json(cuentaActualizada); 
  } catch (error) {
    console.error('Error en updateCuenta:', error); 
    res.status(500).json({ error: 'Error al actualizar la cuenta' });
  }
};

// Eliminar cuenta por ID
const deleteCuenta = async (req, res) => {
  try {
    const { id } = req.params; 
    const cuentaEliminada = await cuentasProcess.deleteCuenta(id); 
    if (!cuentaEliminada) return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.status(200).json({ message: 'Cuenta eliminada correctamente' }); 
  } catch (error) {
    console.error('Error en deleteCuenta:', error); 
    res.status(500).json({ error: 'Error al eliminar la cuenta' });
  }
};

// Agregar producto(s) a cuenta por ID
const addProdToCuenta = async (req, res) => {
  try {
    const { productos } = req.body;
    const { id } = req.params;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'El producto no puede estar vacío' });
    }

    let cuentaActualizada = null;
    for (const prod of productos) {
      cuentaActualizada = await cuentasProcess.addProdToCuenta(prod, id);
    }

    if (cuentaActualizada) {
      res.status(200).json({ message: 'Producto(s) agregado(s)', cuenta: cuentaActualizada });
    } else {
      res.status(404).json({ error: 'Cuenta no encontrada' });
    }
  } catch (error) {
    console.error('Error al editar el contenido de la cuenta ', error);
    res.status(502).json({ error: 'Error al editar el contenido de la cuenta' });
  }
};

// Eliminar producto de cuenta
const removeProd = async (req, res) => {
  try {
    const { prodAEliminar } = req.body;
    const { id } = req.params;

    if (!prodAEliminar || Object.keys(prodAEliminar).length === 0) {
      return res.status(400).json({ error: 'El producto a eliminar no puede estar vacío' });
    }

    const cuenta = await cuentasProcess.removeProd(prodAEliminar, id);

    if (cuenta) {
      res.status(200).json({ message: 'Producto eliminado', cuenta });
    } else {
      res.status(404).json({ error: 'Cuenta no encontrada' });
    }
  } catch (error) {
    console.error('Error al editar el contenido de la cuenta ', error);
    res.status(502).json({ error: 'Error al editar el contenido de la cuenta' });
  }
};

// Obtener cuentas por estado (ej: activa, pagada)
const getByStatus = async (req, res) => {
  try {
    const { estado } = req.body; 
    if (!estado) {
      return res.status(400).json({ error: 'Estado no existe, revisar parámetro' });
    }

    const cuenta = await cuentasProcess.getByStatus(estado); 
    if (cuenta.length > 0) {
      return res.status(200).json(cuenta);
    } else {
      return res.status(404).json({ error: 'No se encontraron cuentas con ese estado' });
    }
  } catch (error) {
    console.error('Error al obtener la cuenta por el estado ', error);
    return res.status(502).json({ error: 'Error al obtener la cuenta por el estado ' });
  }
};

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
};
