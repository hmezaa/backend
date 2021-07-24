var express = require('express');
var router = express.Router();
const passengerToUpdateController = require('../controllers/passenger_to_update');
const isAuth = require('../middleware/check-auth');


router.post('/update/:passengerId', passengerToUpdateController.updatePassengerToUpdate);
router.get('/get/:passengerId', passengerToUpdateController.getPassengerToUpdate);
router.get('/getall', passengerToUpdateController.getAllPassengerToUpdates);
router.post('/delete/:passengerId', passengerToUpdateController.deletePassengerToUpdate);


module.exports = router;