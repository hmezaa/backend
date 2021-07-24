var express = require('express');
var router = express.Router();
const driverToUpdateController = require('../controllers/driver_to_update');
const isAuth = require('../middleware/check-auth');


router.post('/update/:driverId', driverToUpdateController.updateDriverToUpdate);
router.get('/get/:driverId', driverToUpdateController.getDriverToUpdate);
router.get('/getall', driverToUpdateController.getAllDriverToUpdates);
router.post('/delete/:driverId', driverToUpdateController.deleteDriverToUpdate);


module.exports = router;