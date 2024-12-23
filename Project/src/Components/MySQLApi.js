require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.DB_PORT;
app.use(express.json());

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'sys',
  port: process.env.DB_PORT,
});

// Conecta a la base de datos MySQL
db.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      process.exit(1);
    }
    console.log('Conexión a la base de datos MySQL exitosa');
});
  


// Endpoint de prueba
app.get('/ping', (req, res) => {
    res.send('La API está funcionando');
});

// Ejemplo de endpoint
app.post('/data', (req, res) => {
  const { q } = req.body;
  db.query(q, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint para comparar y actualizar datos
app.post('/compare-update', (req, res) => {
  const { object } = req.body;

  // Consulta a la base de datos remota para obtener el lastUpdate del centro específico
  const query = 'SELECT * FROM ' + object;
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al consultar la base de datos remota' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Centro no encontrado en la base de datos remota' });
    }

    const remoteData = results;
    const { lastUpdate: lastUpdateRemote } = remoteData;

    return res.status(200).json({
      remoteData
    });

    // // Comparamos las fechas
    // if (new Date(lastUpdateRemote) > new Date(lastUpdateLocal)) {
    //   // Si la fecha remota es más reciente, devolvemos los datos completos del centro
    //   return res.status(200).json({
    //     shouldUpdate: true,
    //     data: remoteData,
    //   });
    // } else {
    //   // Si la fecha local es igual o más reciente, no es necesario actualizar
    //   return res.status(200).json({
    //     shouldUpdate: false,
    //     message: 'No hay actualizaciones necesarias',
    //   });
    // }
  });
});


app.listen(3000, () => {
  console.log(`Servidor corriendo en el puerto 3000`);
});

