// controllers/dataController.js

const db = require('../config/db');

exports.getAllData = (req, res) => {
  const sqlIzdelki = 'SELECT * FROM izdelek';
  const sqlKategorije = 'SELECT * FROM kategorija';
  
  db.query(sqlIzdelki, (err, resultsIzdelki) => {
    if (err) {
      return res.status(500).send(err);
    }

    db.query(sqlKategorije, (err, resultsKategorije) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.json({
        izdelki: resultsIzdelki,
        kategorije: resultsKategorije
      });
    });
  });
};

