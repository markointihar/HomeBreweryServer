// routes/dataRoutes.js

const express = require('express');
const router = express.Router();
const dataController = require('../controllers/izdelekControler');

router.get('/izdelki', dataController.getAllData);

module.exports = router;
