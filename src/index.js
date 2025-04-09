require('dotenv').config(); 
const express = require('express'); 
const bodyparser = require('body-parser'); 
const cors = require('cors'); 
const crypto = require('crypto'); 
const https = require('https'); 
const fs = require('fs'); 

// límite de peticiones: 
const rateLimit = require('express-rate-limit');

const ipFilter = require('./middlewares/ipFilter'); 
const isAdmin = require('./middlewares/isAdminMiddleware'); 
const verifyToken = require('./middlewares/authMiddleware'); 


const app = express(); 
const corsOptions = {
    origin: ['http://localhost:8100', 'https://cafemanager-de66b.web.app','*'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
    optionSuccessStatus:200,
}

// límite de peticiones 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: {
    success: false,
    message: "Demasiadas peticiones. Intenta más tarde.",
  },
  standardHeaders: true, // Devuelve headers tipo `RateLimit-*`
  legacyHeaders: false, // Desactiva `X-RateLimit-*` (obsoleto)
});


app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(bodyparser.json()); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(apiLimiter);

// Algoritmo AES-256-cbc; 
const algoritm = 'aes-256-cbc'; 
const secretKeyAES = crypto.randomBytes(32); 
const iv = crypto.randomBytes(16); 


// Routing de apis 
const v1User = require('./v1/routes/userRouter');
const v1Producto = require('./v1/routes/productoRouter');  
const v1Cuentas = require('./v1/routes/cuentasRouter'); 
const v1Menu = require('./v1/routes/menuRouter'); 
const v1Files = require('./v1/routes/filesRoutes'); 

app.use('/api/v1/users', v1User); 
app.use('/api/v1/productos', v1Producto); 
app.use('/api/v1/cuentas', v1Cuentas);
app.use('/api/v1/menu', v1Menu); 
app.use('/api/v1/files', v1Files); 


const PORT = process.env.PORT || 3000; 

app.get('/', isAdmin, async (req, res) => {
    res.send('Hola mundo con https '); 
}); 
 
// Ruta protegida de prueba
app.use('/api/v1/admin', ipFilter, (req, res) => {
  res.send('Área protegida'); 
}); 

// Función para cifrar 
function encrypt(text){
  const cipher = crypto.createCipheriv(algoritm, secretKeyAES, iv); 
  let encrypted = cipher.update(text, 'utf8', 'hex'); 
  encrypted += cipher.final('hex'); 
  return { encryptedData: encrypted, iv: iv.toString('hex')}; 
}

// Función para descifrar 
function decrypt(encryptedData, ivHex){
  const decipher = crypto.createDecipheriv(algoritm, secretKeyAES, Buffer.from(ivHex, 'hex')); 
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8'); 
  decrypted += decipher.final('utf8'); 
  return decrypted; 
}

// wea del método de pago (no oficial (obviamente))
app.post('/api/payment', (req, res) => {
    const { cardholderName, cardNumber, expiryDate, cvv } = req.body;
  
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
  
    if (!/^\d{16}$/.test(cardNumber)) {
      return res.status(400).json({ success: false, message: 'Número de tarjeta inválido' });
    }
  
    const [month, year] = expiryDate.split('/').map(Number);
    const expiryDateObj = new Date(`20${year}`, month - 1);
    const today = new Date();
    if (expiryDateObj <= today) {
      return res.status(400).json({ success: false, message: 'La tarjeta ha expirado' });
    }
  
    if (!/^\d{3}$/.test(cvv)) {
      return res.status(400).json({ success: false, message: 'CVV inválido' });
    }

    // Cifrar el numero de tarjeta antes de #almacenarlo", 
    const { encryptedData, iv } = encrypt(cardNumber, cvv); 
  
    // Simulamos que guardamos los datos cifrados
    const paymentData = {
      cardholderName, 
      encryptedCardNumber: encryptedData, 
      expiryDate, 
      encryptedCvv: cvv, 
      iv
    }; 

    // Simulamos el guardado en la base de datos 
    console.log(paymentData); 
  
    return res.json({ success: true, message: 'Pago procesado exitosamente' });
  });

// Propiedad de Jesús Morales 

const options = {
  cert: fs.readFileSync('./cert.pem'), // Ruta al certificado 
  key: fs.readFileSync('./key.pem'), // Ruta a la clave privada
}

//https.createServer(options, app).listen(443, () => {
//  console.log('Servidor https funcionando en https://localhost:443 ')
//}); 

app.listen(8000, () => {
    console.log(`Puerto escuchado en: ${PORT} :D`); 
});