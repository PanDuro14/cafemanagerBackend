const express = require('express'); 
const router = express.Router(); 
const cuentasController = require('../../controller/cuentaController'); 
const verifyToken = require('../../middlewares/authMiddleware'); 

// Propiedad de Jesús Emmanuel Morales Ruvalcaba
router
  .get('/byid/:id', cuentasController.getOneCuentaById)        // obtener cuenta por ID
  .get('/byname/:nombre', cuentasController.getOneCuentaByName) // obtener cuenta por nombre
  .post('/addProd/:id', cuentasController.addProdToCuenta)     // agregar producto a cuenta
  .post('/removeProd/:id', cuentasController.removeProd)       // quitar producto de cuenta
  .post('/byStatus', cuentasController.getByStatus)            // buscar cuentas por estado
  .get('/getOneProduct/:cuentasId/:menuId', cuentasController.getOneProduct) // obtener un prodcuto con el id de la cuenta y el id del producto
  .post('/updateProd/:id', cuentasController.updateProduct)    // Actualizar un producto
  .post('/updateTotal/:id', cuentasController.updateTotal)     // Actualizar el precio total
  .get('/', cuentasController.getAllCuentas)                   // listar todas las cuentas
  .post('/', cuentasController.createOneCuenta)                // crear nueva cuenta
  .put('/:id', cuentasController.updateCuenta)                 // actualizar cuenta
  .delete('/:id', cuentasController.deleteCuenta); // eliminar cuenta (requiere token)


module.exports = router;
