// controllers/dataController.js

//povezava na db
const db = require('../config/db');
const path = require('path');
const multer = require('multer');
//pridboivanje podatkov z queryiji iz pod. baze
// export. => to kar se tu pridobi se izvozi v router, ki potem posta/geta podatke 
exports.getAllData = (req, res) => {
  
  //definicija querij-ev za pridobivaneje izdelkov in kategorij
  const sqlIzdelki = 'SELECT izdelek.id, izdelek.naziv, izdelek.cena, izdelek.opis, izdelek.zaloga, kategorija.ime as ime_kategorije, kategorija.id as kategorija_id FROM izdelek JOIN kategorija ON izdelek.kategorija_id = kategorija.id;';
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
  const sql = `SELECT * FROM izdelek WHERE izdelek.id = ${id}`;

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


exports.purchaseIzdelek = (req, res) => {
  const { id } = req.body;
  const sql = `UPDATE izdelek SET zaloga = zaloga - 1 WHERE id = ${id} AND zaloga > 0`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (result.affectedRows === 0) {
      return res.status(400).send('Izdelka ni na zalogi');
    }

    res.send('Nakup uspešno potrjen');
  });
};


// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage }).single('slika');

exports.createIzdelek = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
 
  const { naziv, cena, opis, zaloga, kategorija_id } = req.body;
  const slika = req.file ? req.file.path : null;
  const sql = 'INSERT INTO izdelek (naziv, cena, opis, zaloga, slika, kategorija_id) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(sql, [naziv, cena, opis, zaloga, slika, kategorija_id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('Pravkar dodan izdelek:', { id: result.insertId, naziv, cena, opis, zaloga, slika, kategorija_id });
    res.send('Izdelek uspešno dodan');
  });
});
};

