// utils/encryptFiles.js
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; // Algoritmo de cifrado

// Función para cifrar un archivo
const encryptFile = (buffer, key) => {
    // Verificamos que la clave no esté vacía o indefinida
    if (!key) {
        throw new Error("Clave de cifrado no definida");
    }

    const iv = crypto.randomBytes(16); // IV aleatorio de 16 bytes
    const cipher = crypto.createCipheriv(algorithm, key, iv); // Crea el cifrador

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);  // Cifra el buffer
    return { iv, encryptedData: encrypted };  // Retorna el IV y los datos cifrados
};

// Función para descifrar un archivo
const decryptFile = (buffer, secretKey) => {
    const iv = buffer.slice(0, 16); // Los primeros 16 bytes corresponden al IV
    const encryptedData = buffer.slice(16); // El resto es el texto cifrado

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'utf8'), iv); // Crear el descifrador

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]); // Descifrar los datos
    return decrypted;
};

// Propiedad de Jesús Emmanuel Morales Ruvalcaba 
module.exports = {
    encryptFile,
    decryptFile
};
