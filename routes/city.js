var express = require('express');
var router = express.Router();
const cityController = require('../controllers/city');


router.post('/create', cityController.createCity );
router.post('/update/:cityId', cityController.updateCity );
router.get('/get/:cityId', cityController.getCity );
router.get('/getall', cityController.getAllCities );
router.post('/get-random-phone-number-by-city', cityController.getRandomPhoneNumberByCity );




module.exports = router;