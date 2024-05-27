// controllers/cartController.js

const db = require('../config/db');

exports.addToCart = (req, res) => {
  const { izdelekId } = req.body;
  const sql = 'INSERT INTO kosarica (izdelek_id) VALUES (?)';

  db.query(sql, [izdelekId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Izdelek dodan v košarico.');
  });
};

exports.getCartItems = (req, res) => {
  const sql = `
    SELECT i.id, i.naziv, i.cena, i.opis, k.ime AS ime_kategorije 
    FROM kosarica k 
    JOIN izdelek i ON k.izdelek_id = i.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
};