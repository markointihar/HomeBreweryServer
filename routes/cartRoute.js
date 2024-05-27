// routes/cartRoute.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart', cartController.getCartItems);
router.post('/cart', cartController.addToCart);

module.exports = router;
