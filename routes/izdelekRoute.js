// routes/dataRoutes.js

const express = require('express');
const router = express.Router();
const izdelekController = require('../controllers/izdelekController');

// export v izdelekController.js omogoči da s lahko tu uporabljajo .getData/addIzdelek
router.get('/izdelki', izdelekController.getAllData);

//DodajIzdečel.tsx
router.get('/dodajIzdelek', izdelekController.getKategorije ) // pridobivanje kategorij za dodajanje izdelka
router.post('/izdelki', izdelekController.createIzdelek); //pošiljanje novega izdelka na db

router.get('/izdelki/:id', izdelekController.getIzdelekById);
router.post('/izdelki/kupi', izdelekController.purchaseIzdelek);

module.exports = router;
