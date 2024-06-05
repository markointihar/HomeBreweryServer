// routes/dataRoutes.js

const express = require('express');
const router = express.Router();
const izdelekController = require('../controllers/izdelekController');

router.get('/izdelki', izdelekController.getAllData); // Endpoint za pridobivanje vseh izdelkov
router.get('/dodajIzdelek', izdelekController.getKategorije); // pridobivanje kategorij za dodajanje izdelka
router.post('/izdelki', izdelekController.createIzdelek); // pošiljanje novega izdelka na db
router.get('/izdelki/:id', izdelekController.getIzdelekById);
router.post('/izdelki/kupi', izdelekController.purchaseIzdelek);

module.exports = router;
