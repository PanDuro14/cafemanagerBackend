const express = require('express'); 
const router = express.Router(); 
const cuentasController = require('../../controller/cuentaController'); 

router  
    .get('/byid/:id', cuentasController.getOneCuentaById)
    .get('/byname/:nombre', cuentasController.getOneCuentaByName)
    .post('/addProd/:id', cuentasController.addProdToCuenta)
    .post('/removeProd/:id', cuentasController.removeProd)
    .post('/byStatus', cuentasController.getByStatus)
    .get('/', cuentasController.getAllCuentas)
    .post('/', cuentasController.createOneCuenta)
    .put('/:id', cuentasController.updateCuenta)
    .delete('/:id', cuentasController.deleteCuenta);

module.exports = router;
