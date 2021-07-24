var express = require('express');
var router = express.Router();
const cityBoundryController = require('../controllers/city_boundry');


router.post('/create', cityBoundryController.createCityBoundry);
router.post('/bulk-create', cityBoundryController.createBulkCityBoundry);
router.post('/update-all-boundries/:cityId', cityBoundryController.updateCityBoundry);
router.post('/delete/:id', cityBoundryController.deleteCityBoundry);
router.get('/get/:id', cityBoundryController.getCityBoundry);
router.get('/getcity-boundries-by-id/:cityId', cityBoundryController.getAllCityBoundriesByCityId);
router.post('/getcity-boundries-by-name', cityBoundryController.getAllCityBoundriesByCityName);



module.exports = router;