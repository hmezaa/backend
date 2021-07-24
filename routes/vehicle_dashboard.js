var express = require('express');
var router = express.Router();
const vehicleController = require('../controllers/dashboard/vehicle');
const isAuth = require('../middleware/check-auth');


router.get('/getall', vehicleController.getAllVehicles );


module.exports = router;