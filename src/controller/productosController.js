const productoProcess = require('../process/productoProcess');  

/** Obtener todos los productos */
const getAllProductos = async (req, res) => {
    try {
        const productos = await productoProcess.getAllProductos(); 
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener todos los productos', error: error.message });
    }
};

/** Obtener un solo producto */
const getOneProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productoProcess.getOneProducto(id);
        if (!producto) {
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error(`Error al obtener el producto ${req.params.id}:`, error);
        res.status(500).json({ message: `Error al obtener el producto ${req.params.id}`, error: error.message });
    }
};

/** Crear un nuevo producto */
const createProducto = async (req, res) => {
    try {
        const { nombre, precio, categoria, proveedor, cantidad } = req.body;
        if (!nombre || !precio || !categoria || !proveedor || !cantidad) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const producto = await productoProcess.createProducto(nombre, precio, categoria, proveedor, cantidad);
        res.status(201).json({ message: 'Producto creado correctamente', producto });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error al crear un nuevo producto', error: error.message });
    }
};

/** Actualizar un producto */
const updateProducto = async (req, res) => {
    try {
        const { nombre, precio, categoria, proveedor, cantidad } = req.body;
        const { id } = req.params;

        const producto = await productoProcess.updateProducto(nombre, precio, categoria, proveedor, cantidad, id);
        if (!producto) {
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
        }

        res.status(200).json({ message: 'Producto actualizado correctamente', producto });
    } catch (error) {
        console.error(`Error al actualizar el producto ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error al editar el producto', error: error.message });
    }
};

/** Eliminar un producto */
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productoProcess.deleteProducto(id);
        if (!result) {
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
        }

        res.status(200).json({ message: `Producto con ID ${id} eliminado correctamente` });
    } catch (error) {
        console.error(`Error al eliminar el producto ${req.params.id}:`, error);
        res.status(500).json({ message: `Error al eliminar el producto ${req.params.id}`, error: error.message });
    }
};

module.exports = {
    getAllProductos,
    getOneProducto,
    createProducto,
    updateProducto,
    deleteProducto
};
