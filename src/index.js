require('dotenv').config(); 
const express = require('express'); 
const bodyparser = require('body-parser'); 
const cors = require('cors'); 
const https = require('https'); 
const fs = require('fs'); 

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

app.use(cors(corsOptions));
app.use(bodyparser.json()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.options('*', cors(corsOptions)); 

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

app.get('/', async (req, res) => {
    res.send('Hola mundo con https '); 
}); 
 
app.use('/api/v1/admin',  isAdmin, (req, res) => {
  res.send('Área protegida'); 
}); 

app.use('/verifyToken', verifyToken, (req, res) => {
  res.send('Usuario verificado'); 
}); 

// Propiedad de Jesús Morales 

const options = {
  cert: fs.readFileSync('./cert.pem'), // Ruta al certificado 
  key: fs.readFileSync('./key.pem'), // Ruta a la clave privada
}

//https.createServer(options, app).listen(443, () => {
//  console.log('Servidor https funcionando en https://localhost:443 ')
//}); 

app.listen(PORT || 8000, () => {
    console.log(`Puerto escuchado en: ${PORT} :D`); 
});