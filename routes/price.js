var express = require('express');
var router = express.Router();
const priceController = require('../controllers/price');


router.post('/create', priceController.createPrice);
router.post('/update/:priceId', priceController.updatePrice);
router.post('/delete/:priceId', priceController.deletePrice);
router.get('/get/:priceId', priceController.getPrice);
router.post('/get-by-city-and-vehicle', priceController.getPriceByCityAndVehicle);
router.get('/getall', priceController.getAllPrices);
router.post('/find-dt', priceController.findDT);




module.exports = router;