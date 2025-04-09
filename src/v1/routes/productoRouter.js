const express = require('express'); 
const router = express.Router(); 
const productoController = require('../../controller/productosController'); 
// Propiedad de Jesús Emmanuel Morales Ruvalcaba

router
  .get('/', productoController.getAllProductos)       // obtener todos los productos
  .get('/:id', productoController.getOneProducto)     // obtener producto por id
  .post('/', productoController.createProducto)       // crear nuevo producto
  .put('/:id', productoController.updateProducto)     // actualizar producto
  .delete('/:id', productoController.deleteProducto); // eliminar producto

module.exports = router;
