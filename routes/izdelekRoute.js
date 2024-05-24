// routes/dataRoutes.js

const express = require('express');
const router = express.Router();
const izdelekController = require('../controllers/izdelekControler');

// export v izdelekControler.js omogoči da s lahko tu uporabljajo .getData/addIzdelek
router.get('/izdelki', izdelekController.getAllData);
router.get('/dodajIzdelek', izdelekController.getKategorije )
router.post('/izdelki', izdelekController.addIzdelek);

module.exports = router;
