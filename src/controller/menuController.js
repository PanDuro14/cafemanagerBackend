const menuProcess = require('../process/menuProcess');
const menuService = require('../services/menuService');


const getAllMenuItems = async (req, res) => {
    try {
        const menu = await menuProcess.getAllMenuItems();
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error en getAllMenuItems:', error);
        res.status(500).json({ error: error.message });
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await menuProcess.getMenuItemById(id);
        res.status(200).json(menuItem);
    } catch (error) {
        console.error('Error en getMenuItemById:', error);
        res.status(500).json({ error: error.message });
    }
};

const createMenuItem = async (req, res) => {
    try {
        //console.log("REQ BODY:", req.body); // Verificar la estructura de la petición
        //console.log('📷 Imagen recibida:', req.file);

        const { nombre, descripcion, categoria, tamanosPrecios } = req.body;
        const imagenBuffer = req.file ? req.file.buffer : null;

        // Convertir `tamanosPrecios` a JSON válido
        let tamanosPreciosArray = [];
        try {
            tamanosPreciosArray = JSON.parse(tamanosPrecios);
        } catch (error) {
            return res.status(400).json({ error: "Formato inválido en tamanosPrecios, debe ser un JSON válido" });
        }

        const newItem = await menuService.createMenuItem(
            nombre, descripcion, categoria, imagenBuffer, tamanosPreciosArray
        );

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error en createMenuItem:", error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body); // Ver qué está llegando

        const { nombre, descripcion, categoria, tamanosPrecios } = req.body;
        const imagenBuffer = req.file ? req.file.buffer : null;
        const id = req.params.id; // ID desde la URL

        // Convertir `tamanosPrecios` de string a JSON válido
        let tamanosPreciosArray = [];
        try {
            tamanosPreciosArray = JSON.parse(tamanosPrecios);
        } catch (error) {
            return res.status(400).json({ error: "Formato inválido en tamanosPrecios, debe ser un JSON válido" });
        }

        const updatedItem = await menuService.updateMenuItem(
            id, nombre, descripcion, categoria, imagenBuffer, tamanosPreciosArray
        );

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("Error en updateMenuItem:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};


const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await menuProcess.deleteMenuItem(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error en deleteMenuItem:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAllMenuItemsWithoutImages = async (req, res) => {
    try {
        const menu = await menuProcess.getAllMenuItemsWithoutImages();
        res.status(200).json(menu);
    } catch (error) {
        console.error('Error en getAllMenuItems:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem, 
    getAllMenuItemsWithoutImages
};
