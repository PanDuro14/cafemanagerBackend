//Propiedad de: Jesús Emmanuel Morales Ruvalcaba
const allowedIPs = ['123.45.67.89', '192.168.1.100']; // IPs autorizadas

const ipFilter = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    // Verifica si la IP del cliente está autorizada
    if (allowedIPs.includes(clientIP)) {
        next(); // Continúa si la IP está permitida
    } else {
        res.status(403).json({ message: 'Acceso denegado' }); // Rechaza el acceso
    }
};

// Exporta los módulos realizadosxd
module.exports = ipFilter;
