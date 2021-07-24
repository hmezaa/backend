var express = require('express');
var router = express.Router();
const vehicleController = require('../controllers/vehicle');


router.post('/create-or-update/:driverId', vehicleController.createOrUpdateVehicle );
router.post('/update/:id', vehicleController.updateVehicle );
router.post('/delete/:id', vehicleController.deleteVehicle );
router.get('/get/:id', vehicleController.getVehicle );
router.get('/get-by-driver/:driverId', vehicleController.getVehicleByDriver );
router.get('/getall', vehicleController.getAllVehicles );



module.exports = router;