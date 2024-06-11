const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Busqueda = require('./models/Busqueda'); // Asegúrate de tener la ruta correcta a tu modelo

const app = express();
app.use(cors());
app.use(express.json()); // Para manejar JSON en las peticiones

// Conexión a la base de datos MongoDB
const db = 'mongodb://localhost:27017/dataSearch';
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Servir archivos estáticos desde varias carpetas
app.use(express.static(path.join(__dirname, '..', 'cliente')));
app.use('/beaufort', express.static(path.join(__dirname, '..', 'beaufort')));
app.use('/iconos', express.static(path.join(__dirname, '..', 'iconos')));
app.use('/weather', express.static(path.join(__dirname, '..', 'weather')));

// Servir index.html cuando se acceda a la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'cliente', 'index.html'));
});

// Ruta para guardar una búsqueda
app.post('/api/busquedas', async (req, res) => {
  const { ciudad } = req.body;
  const nuevaBusqueda = new Busqueda({ ciudad });
  await nuevaBusqueda.save();
  res.status(201).json(nuevaBusqueda);
});

// Ruta para obtener las búsquedas recientes
app.get('/api/busquedas', async (req, res) => {
  const busquedas = await Busqueda.find().sort({ fecha: -1 }).limit(10);
  res.json(busquedas);
});

// Escuchar en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
