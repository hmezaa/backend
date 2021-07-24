var express = require('express');
var router = express.Router();
const priceController = require('../controllers/dashboard/price');
const isAuth = require('../middleware/check-auth');


router.get('/getall-prices', priceController.getAllPrices);
router.post('/create', priceController.createPrice);
router.post('/update/:priceId', priceController.updatePrice);
router.post('/delete/:priceId', priceController.deletePrice);
router.get('/get/:priceId', priceController.getPrice);

module.exports = router;