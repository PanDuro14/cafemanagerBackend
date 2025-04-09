const express = require('express'); 
const multer = require('multer'); 
const filesController = require('../../controller/fileController'); 
const router = express.Router();

// Configuración de multer para subir archivos en memoria (máx 10MB)
const storage = multer.memoryStorage(); 
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// Propiedad de Jesús Emmanuel Morales Ruvalcaba
router
  .post('/upload', upload.single('file'), filesController.uploadFileController)     // subir archivo
  .get('/download/:filename', filesController.downloadFileController);              // descargar archivo

module.exports = router;
