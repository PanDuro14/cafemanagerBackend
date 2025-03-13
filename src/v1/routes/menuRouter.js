const express = require('express'); 
const router = express.Router(); 
const menuController = require('../../controller/menuController'); 
const multer = require('multer'); 

// Configurar Multer para manejo de imágenes
const storage = multer.memoryStorage(); 
const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

router 
    .get('/getMenuWI/', menuController.getAllMenuItemsWithoutImages)
    .get('/', menuController.getAllMenuItems) // Obtener todos los productos
    .get('/:id', menuController.getMenuItemById) // Obtener un producto por ID (Agregar si es necesario)
    .post('/', upload.single('imagenBuffer'), menuController.createMenuItem) // Crear producto con imagen
    .put('/:id', upload.single('imagenBuffer'), menuController.updateMenuItem) // Actualizar producto con imagen
    .delete('/:id', menuController.deleteMenuItem); // Eliminar producto

module.exports = router;
