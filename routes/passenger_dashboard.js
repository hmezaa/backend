var express = require('express');
var router = express.Router();
const passengerController = require('../controllers/dashboard/passenger');
const isAuth = require('../middleware/check-auth');


router.get('/getall-active', passengerController.getAllActivatedPassengers);
router.get('/getall-block', passengerController.getAllBlockedPassengers);
router.post('/signup-with-phone-number', passengerController.signUpWithPhoneNumber);
router.post('/update/:passengerId', passengerController.updatePassenger);
router.post('/delete/:passengerId', passengerController.deletePassenger);
router.get('/get/:passengerId', passengerController.getbyId);
router.get('/activate/:passengerId', passengerController.activatePassenger);
router.get('/block/:passengerId', passengerController.blockPassenger);
router.get('/search-passenger/:name', passengerController.searchPassenger);













module.exports = router;