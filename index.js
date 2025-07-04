require('dotenv').config(); 
const express = require('express'); 
const bodyparser = require('body-parser'); 
const cors = require('cors'); 

const app = express(); 
const corsOptions = {
    //origin: ['http://localhost:8100', 'https://cafemanager-de66b.web.app','*'],
    origin: ['*'], 
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
const v1User = require('./src/v1/routes/userRouter');
const v1Producto = require('./src/v1/routes/productoRouter');  
const v1Cuentas = require('./src/v1/routes/cuentasRouter'); 
const v1Menu = require('./src/v1/routes/menuRouter'); 
const v1Files = require('./src/v1/routes/filesRoutes'); 

app.use('/api/v1/users', v1User); 
app.use('/api/v1/productos', v1Producto); 
app.use('/api/v1/cuentas', v1Cuentas);
app.use('/api/v1/menu', v1Menu); 
app.use('/api/v1/files', v1Files); 


const PORT = process.env.PORT || 3000; 

app.get('/', async (req, res) => {
    res.send('Hola mundo con https '); 
}); 

// Propiedad de Jesús Morales 

app.listen(PORT || 8000, '0.0.0.0', () => {
    console.log(`Servidor escuchado en: ${PORT} :D`); 
});