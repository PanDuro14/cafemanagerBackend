require('dotenv').config(); 
const express = require('express'); 
const bodyparser = require('body-parser'); 
const cors = require('cors'); 

const app = express(); 
const corsOptions = {
    origin: ['http://localhost:8100', '*'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(bodyparser.json()); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// Routing de apis 
const v1User = require('./v1/routes/userRouter');
const v1Producto = require('./v1/routes/productoRouter');  
const v1Cuentas = require('./v1/routes/cuentasRouter'); 
const v1Menu = require('./v1/routes/menuRouter'); 

app.use('/api/v1/users', v1User); 
app.use('/api/v1/productos', v1Producto); 
app.use('/api/v1/cuentas', v1Cuentas);
app.use('/api/v1/menu', v1Menu); 



const PORT = process.env.PORT || 3000; 

app.get('/', async (req, res) => {
    res.send('Hola mundo'); 
}); 

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
  
    return res.json({ success: true, message: 'Pago procesado exitosamente' });
  });

  

// Propiedad de Jesús Morales 
app.listen(PORT, () => {
    console.log(`Puerto escuchado en: ${PORT} :D`); 
});