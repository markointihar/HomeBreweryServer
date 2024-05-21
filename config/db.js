const mysql = require('mysql2');
require('dotenv').config();
// Konfiguracija povezave z MySQL podatkovno bazo
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  

// Povezovanje z bazo
connection.connect((err) => {
  if (err) {
    console.error('Napaka pri povezovanju z bazo:', err);
    return;
  }
  console.log('Uspešno povezan na MySQL podatkovno bazo');
});

module.exports = connection;