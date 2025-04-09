const filesService = require('../services/filesService'); 
const path = require('path'); 

// controlador para subir un archivo para cifrarlo 
const uploadFileController = async(req, res ) => {
    try {
        const file = req.file; 
        console.log('Archivo recibido: ', file); 
        const encryptedFilePath = await filesService.saveEncryptedFile(file); 
        res.status(200).json({ message: 'Archivo cifrado y guardado correctamente ', encryptedFilePath}); 
    } catch (error){
        res.status(500).json({ error: 'Error al guardar el archivo'}); 
    }
}
// Propiedad de Jesús Emmanuel Morales Ruvalcaba 
// Controlador para descargar el archivo y descifrarlo 
const downloadFileController = async (req, res) => {
    const { filename } = req.params;

    // Asegurarnos de que la ruta de uploads esté correctamente configurada fuera de 'src'
    const uploadDir = path.resolve(__dirname, '../../uploads'); // Ruta absoluta hacia la carpeta uploads fuera de src
    const filePath = path.join(uploadDir, filename); // Ruta del archivo cifrado
    const outputPath = path.join(__dirname, '../../downloads', filename.replace('.enc', '')); // Ruta del archivo descifrado

    try {
        await filesService.decryptFileForDownload(filePath, outputPath); // Descifrar el archivo
        res.download(outputPath); // Descarga el archivo descifrado
    } catch (error) {
        console.error('Error al descifrar el archivo:', error);
        res.status(500).json({ error: 'Error al descifrar el archivo' });
    }
};

module.exports = {
    uploadFileController, 
    downloadFileController
}