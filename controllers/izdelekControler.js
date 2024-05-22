// controllers/dataController.js

const db = require('../config/db');

exports.getAllData = (req, res) => {
  const sql = 'select * from izdelek';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
};
