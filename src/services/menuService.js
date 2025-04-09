const menuDB = require('../db/menudb'); 

// Obtener todos los ítems del menú (con imágenes)
const getAllMenuItems = async () => {
  try {
    const menu = await menuDB.getAllMenuItems();
    if (!menu.length) throw new Error('No hay productos en el menú');
    return menu;
  } catch (error) {
    throw new Error('Error en getAllMenuItems: ' + error.message);
  }
};

// Obtener ítem del menú por ID
const getMenuItemById = async (id) => {
  try {
    if (!id) throw new Error('ID inválido');
    const menuItem = await menuDB.getMenuItemById(id);
    if (!menuItem.length) throw new Error('Producto no encontrado');
    return menuItem;
  } catch (error) {
    throw new Error('Error en getMenuItemById: ' + error.message);
  }
};

// Crear nuevo ítem de menú
const createMenuItem = async (nombre, descripcion, categoria, imagenBuffer, tamanosPrecios) => {
  try {
    if (!nombre || !categoria || !tamanosPrecios.length) {
      throw new Error('Faltan datos obligatorios');
    }
    return await menuDB.createMenuItem(nombre, descripcion, categoria, imagenBuffer, tamanosPrecios);
  } catch (error) {
    throw new Error('Error en createMenuItem: ' + error.message);
  }
};

// Actualizar ítem existente del menú
const updateMenuItem = async (id, nombre, descripcion, categoria, imagenBuffer, tamanosPrecios) => {
  try {
    if (!id) throw new Error('ID inválido');
    return await menuDB.updateMenuItem(id, nombre, descripcion, categoria, imagenBuffer, tamanosPrecios);
  } catch (error) {
    throw new Error('Error en updateMenuItem: ' + error.message);
  }
};

// Eliminar ítem del menú por ID
const deleteMenuItem = async (id) => {
  try {
    if (!id) throw new Error('ID inválido');
    const deleted = await menuDB.deleteMenuItem(id);
    if (!deleted) throw new Error('Producto no encontrado');
    return { message: 'Producto eliminado correctamente' };
  } catch (error) {
    throw new Error('Error en deleteMenuItem: ' + error.message);
  }
};

// Obtener todos los ítems del menú sin imágenes (para listar rápido)
const getAllMenuItemsWithoutImages = async () => {
  try {
    const menu = await menuDB.getAllMenuItemsWithoutImages();
    if (!menu.length) throw new Error('No hay productos en el menú');
    return menu;
  } catch (error) {
    throw new Error('Error en getAllMenuItemsWithoutImages: ' + error.message);
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
