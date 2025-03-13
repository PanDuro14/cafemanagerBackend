const express = require('express'); 
const router = express.Router(); 
const productoController = require('../../controller/productosController'); 

router
    .get('/', productoController.getAllProductos)
    .get('/:id', productoController.getOneProducto)
    .post('/', productoController.createProducto)
    .put('/:id', productoController.updateProducto) 
    .delete('/:id', productoController.deleteProducto);

module.exports = router;
