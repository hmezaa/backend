var express = require('express');
var router = express.Router();
const passengerPreferenceController = require('../controllers/passenger_prefrences');

// fara now



// before fara


router.post('/create/:passengerId', passengerPreferenceController.createPassengerPreference);
router.post('/update-passengerpreference/:passengerId', passengerPreferenceController.updatePassengerPreference);
router.get('/get/:passengerPreferenceId', passengerPreferenceController.getPassengerPreference);
router.get('/get-by-passenger/:passengerId', passengerPreferenceController.getPassengerPreferenceByPassenger);
router.get('/getall', passengerPreferenceController.getAllPassengerPreferences);
router.post('/delete/:passengerPreferenceId', passengerPreferenceController.deletePassengerPreference);



module.exports = router;