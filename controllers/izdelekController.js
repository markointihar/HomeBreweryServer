// controllers/dataController.js

//povezava na db
const db = require('../config/db');

//pridboivanje podatkov z queryiji iz pod. baze
// export. => to kar se tu pridobi se izvozi v router, ki potem posta/geta podatke 
exports.getAllData = (req, res) => {
  
  //definicija querij-ev za pridobivaneje izdelkov in kategorij
  const sqlIzdelki = 'SELECT izdelek.id, izdelek.naziv, izdelek.cena, izdelek.opis, kategorija.ime as ime_kategorije, kategorija.id as kategorija_id FROM izdelek JOIN kategorija ON izdelek.kategorija_id = kategorija.id;';
  const sqlKategorije = 'SELECT * FROM kategorija';
  
  //izvanaje querijev in prvo pridobivanje izdelkov 
  db.query(sqlIzdelki, (err, resultsIzdelki) => {
    if (err) {
      return res.status(500).send(err);
    }

    //pridobivanje kategorije
    db.query(sqlKategorije, (err, resultsKategorije) => {
      if (err) {
        return res.status(500).send(err);
      }

      // razbiranje kategorij in izdelkov
      res.json({
        izdelki: resultsIzdelki,
        kategorije: resultsKategorije
      });
    });
  });
};

exports.getIzdelekById = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM izdelek WHERE izdelek.id = ${id  }`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.length === 0) {
      return res.status(404).send('Izdelek ne obstaja');
    }

    res.json(result[0]);
  });
};



exports.getKategorije = (req ,res)=>{
  const sqlKategorije = 'SELECT * FROM kategorija';
  
  //izvanaje querijev in prvo pridobivanje izdelkov 
  db.query(sqlKategorije, (err, resultsKategorije) => {
    if (err) {
      return 'error pri queriju ',res.status(500).send(err);
    }

    // razbiranje kategorij in izdelkov
      res.json({
        kategorije: resultsKategorije
      });
      
  });
} 


exports.addIzdelek = (req, res) => {
  const { naziv, cena, opis, kategorija_id } = req.body;
  const sql = 'INSERT INTO izdelek (naziv, cena, opis, kategorija_id) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [naziv, cena, opis, kategorija_id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send('Izdelek uspešno dodan!');
  });
};
