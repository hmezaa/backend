var express = require('express');
var router = express.Router();
const vehicleTypeController = require('../controllers/vehicle_type');


router.post('/create', vehicleTypeController.createVehicleType);
router.post('/update/:id', vehicleTypeController.updateVehicleType);
router.post('/delete/:id', vehicleTypeController.deleteVehicleType);
router.get('/get/:id', vehicleTypeController.getVehicleType);
router.get('/getall', vehicleTypeController.getAllVehicleTypes);
router.post('/getallvehicletypes-by-city', vehicleTypeController.getAllVehicleTypesByCity);



module.exports = router;