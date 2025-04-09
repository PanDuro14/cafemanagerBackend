require('dotenv').config(); 
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); 
const encryptUtils = require('../utils/fileEncryption'); 
// Propiedad de Jesús Emmanuel Morales Ruvalcaba 
const secret = crypto.randomBytes(32); 

// Ruta para guardar el archivo cifrado
const saveEncryptedFile = async (file) => {
    // 1. Asegurar que el directorio uploads/ existe (crear si no)
    const uploadDir = path.join(__dirname, '../..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Directorio creado: ${uploadDir}`);
    } else {
        console.log(`Directorio existente: ${uploadDir}`);
    }

    // 2. Guardar directamente el archivo recibido (sin pre-chequeos)
    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    console.log(`Archivo guardado: ${filePath}`);

    // 3. Cifrar el archivo usando AES-256 con la clave del .env
    console.log('Iniciando cifrado del archivo...');
    const key = Buffer.from(secret, 'utf8');  // ajustar encoding según formato de la clave
    try {
        // Asegúrate de que `encryptBuffer` esté funcionando correctamente
        const { iv, encryptedData } = encryptUtils.encryptFile(file.buffer, key);
        const encryptedFilePath = `${filePath}.enc`;
        const outputBuffer = Buffer.concat([iv, encryptedData]);
        fs.writeFileSync(encryptedFilePath, outputBuffer);
        console.log(`Archivo cifrado y guardado en: ${encryptedFilePath}`);
        fs.unlinkSync(filePath); 
        return encryptedFilePath;
    } catch (error) {
        console.error('Error al cifrar el archivo:', error);
        throw new Error('Error al cifrar el archivo');
    }
};

// Ruta para descifrar el archivo
const decryptFileForDownload = async (filePath, outputPath) => {
    const downloadDir = path.join(__dirname, '../..', 'downloads'); // Directorio de salida para los archivos descifrados

    // Crear el directorio si no existe
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
        console.log(`Directorio creado: ${downloadDir}`);
    } else {
        console.log(`Directorio existente: ${downloadDir}`);
    }

    // Leemos el archivo cifrado en memoria
    const encryptedData = fs.readFileSync(filePath); // Leer archivo cifrado en memoria

    // Desencriptar el archivo
    try {
        const decryptedData = encryptUtils.decryptFile(encryptedData, secret); // Utiliza la función de descifrado en memoria
        fs.writeFileSync(outputPath, decryptedData); // Guardamos el archivo descifrado en disco
        console.log(`Archivo descifrado y guardado en: ${outputPath}`);
    } catch (error) {
        console.error('Error al descifrar el archivo:', error);
        throw new Error('Error al descifrar el archivo');
    }

    return outputPath; // Devolvemos la ruta del archivo descifrado
};


module.exports = {
    saveEncryptedFile,
    decryptFileForDownload
};
