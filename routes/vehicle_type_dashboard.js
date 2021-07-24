var express = require('express');
var router = express.Router();
const vehicleTypeController = require('../controllers/dashboard/vehicle_type');
const isAuth = require('../middleware/check-auth');


router.get('/getall-vehicletypes-dd', vehicleTypeController.getAllVehicleTypesDD);

module.exports = router;