const menuProcess = require('../process/menuProcess');
const menuService = require('../services/menuService');

// Obtener todos los ítems del menú (con imágenes)
const getAllMenuItems = async (req, res) => {
  try {
    const menu = await menuProcess.getAllMenuItems();
    res.status(200).json(menu);
  } catch (error) {
    console.error('Error en getAllMenuItems:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener ítem del menú por ID
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

// Crear nuevo ítem en el menú
const createMenuItem = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, tamanosPrecios } = req.body;
    const imagenBuffer = req.file ? req.file.buffer : null;

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

// Actualizar ítem del menú por ID
const updateMenuItem = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, tamanosPrecios } = req.body;
    const imagenBuffer = req.file ? req.file.buffer : null;
    const id = req.params.id;

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

// Eliminar ítem del menú por ID
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

// Obtener ítems del menú sin imágenes (para vistas rápidas)
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
