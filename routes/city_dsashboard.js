var express = require('express');
var router = express.Router();
const cityController = require('../controllers/dashboard/city');
const isAuth = require('../middleware/check-auth');


router.get('/getall-city-dd', cityController.getAllCitiesDD);
router.post('/create', cityController.createCity );
router.post('/update/:cityId', cityController.updateCity );
router.get('/get/:cityId', cityController.getCity );
router.get('/getall', cityController.getAllCities );
router.post('/get-random-phone-number-by-city', cityController.getRandomPhoneNumberByCity );

module.exports = router;