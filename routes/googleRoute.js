const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');
const { route } = require('./izdelekRoute');

router.get('/login', googleController.loginGoogle);
router.get('/google/redirect', googleController.redirectGoogle);
router.get('/dodaj-dogodek', googleController.dodajDogodek);
router.get('/logout', googleController.logoutGoogle);

module.exports = router;