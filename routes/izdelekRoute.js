// routes/dataRoutes.js

const express = require('express');
const router = express.Router();
const izdelekController = require('../controllers/izdelekController');

// export v izdelekController.js omogoči da s lahko tu uporabljajo .getData/addIzdelek
router.get('/izdelki', izdelekController.getAllData);
router.get('/dodajIzdelek', izdelekController.getKategorije )
router.post('/izdelki', izdelekController.addIzdelek);
router.get('/izdelki/:id', izdelekController.getIzdelekById);

module.exports = router;
