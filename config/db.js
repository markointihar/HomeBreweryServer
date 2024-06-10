const mysql = require('mysql2');
require('dotenv').config();
// Konfiguracija povezave z MySQL podatkovno bazo
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Prilagodite glede na potrebe vaše aplikacije
  queueLimit: 0 // Neomejena čakalna vrsta
});
  

// Povezovanje z bazo
connection.getConnection((err) => {
  if (err) {
    console.error('Napaka pri povezovanju z bazo:', err);
    return;
  }
  console.log('Uspešno povezan na MySQL podatkovno bazo');
});

module.exports = connection;