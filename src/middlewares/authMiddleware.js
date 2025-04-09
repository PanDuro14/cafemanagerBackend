const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar el token JWT de autorización
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // extrae el token Bearer

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido o expirado' });

    req.userId = decoded.userid; // guardar el ID decodificado en la request
    next(); // continuar si el token es válido
  });
};

// Propiedad de Jesús Emmanuel Morales Ruvalcaba
module.exports = verifyToken;
