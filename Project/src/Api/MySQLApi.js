require('dotenv').config({ path: '../../.env' });
const express = require('express');
const mysql = require('mysql2');
const app = express();
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

    // if (results.length === 0) {
    //   return res.status(404).json({ error: 'El objeto no encontrado en la base de datos remota' });
    // }

    const remoteData = results;

    return res.status(200).json({
      remoteData
    });
  });
});

// Endpoint para insertar datos
app.post('/insert', (req, res) => {
  const { table, data } = req.body;

  // Construir la consulta SQL de inserción
  const fields = Object.keys(data).join(', ');
  const values = Object.values(data).map(value => mysql.escape(value)).join(', ');

  const queryIn = `INSERT INTO ${table} (${fields}) VALUES (${values})`;

  console.log(queryIn);

  db.query(queryIn, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al insertar datos en la base de datos' });
    }
    return res.status(200).json({ message: 'Datos insertados correctamente', results });
  });
});

// Endpoint para actualizar datos
app.post('/update', (req, res) => {
  const { table, data, id } = req.body;

  // Construir la consulta SQL de actualización
  const updates = Object.keys(data).map(key => `${key} = ${mysql.escape(data[key])}`).join(', ');

  const query = `UPDATE ${table} SET ${updates} WHERE id = ${mysql.escape(id)}`;

  console.log(query);

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
    }
    return res.status(200).json({ message: 'Datos actualizados correctamente', results });
  });
});

// Endpoint para eliminar datos
app.post('/delete', (req, res) => {
  const { table, id } = req.body;

  const query = `DELETE FROM ${table} WHERE id = ${mysql.escape(id)}`;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al eliminar datos en la base de datos' });
    }
    return res.status(200).json({ message: 'Datos eliminados correctamente', results });
  });
});

app.listen(3000, () => {
  console.log(`Servidor corriendo en el puerto 3000`);
});

