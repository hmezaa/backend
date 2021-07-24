var express = require('express');
var router = express.Router();
const passengerController = require('../controllers/passenger');
const isAuth = require('../middleware/check-auth');

// now fara
router.post('/signup-with-phone-number', passengerController.signUpWithPhoneNumber);
router.post('/signup-with-out-data', passengerController.signUpWithOutData);
router.post('/signin-with-phone-number', passengerController.signInWithPhoneNumber);
router.post('/signin-with-out-data/:anonymousId', passengerController.signInWithOutData);
router.post('/update-phone-isanonimous/:passengerId', passengerController.updatePassengerPhoneNumber);
router.post('/update-phone-city-isanonimous/:passengerId', passengerController.updatePassengerPhoneNumberAndCity);
router.post('/update-first-last-phone-image/:passengerId', passengerController.updateFirstLastPhoneImage);
router.post('/update-first-last-name/:passengerId', passengerController.updatePassengerFirstLastName);
router.get('/get/:passengerId', passengerController.getbyId);
router.get('/get-passenger-image/:passengerId', passengerController.getImagebyId);
router.post('/update-image/:passengerId', passengerController.updatePassengerImage);
router.post('/update/:passengerId', passengerController.updatePassenger);
router.post('/update-preffered-vehicletype/:passengerId', passengerController.updatePrefferedVehicleType);
router.post('/preffered-vehicletype-status/:passengerId', passengerController.prefferedVehicleTypeStatus);
router.post('/approve-update/:passengertoupdateId', passengerController.approveUpdatePassenger);
router.post('/decline-update/:passengertoupdateId', passengerController.declineUpdatePassenger);
router.post('/update-city/:passengerId', passengerController.updatePassengerCity);
router.get('/activate/:passengerId', passengerController.activatePassenger);
router.get('/block/:passengerId', passengerController.blockPassenger);
router.post('/update-current-location/:passengerId', passengerController.updateCurrentLocation);
router.get('/getall', passengerController.getAll);
router.post('/social-verifier', passengerController.socialVerifier);
router.get('/getall-active', passengerController.getAllActivatedPassengers);
router.get('/getall-block', passengerController.getAllBlockedPassengers);






// before fara
router.post('/signup', passengerController.createPassenger);
router.post('/signin', passengerController.signinPassenger);
router.post('/resetpassword/:id', passengerController.resetPassword);
router.post('/logout/:passengerId', passengerController.logoutPassenger);
router.post('/isLogin_True/:passengerId', passengerController.isLogedInTrue);
router.post('/change-passenger-availabiliy-status/:passengerId', passengerController.changePassengerAvailabiliyStatus);
router.get('/get-availability-status/:passengerId', passengerController.getAvailabilityStatus);
router.get('/getall-saved-locations/:passengerId', passengerController.getAllSavedLocations);
router.post('/find-passenger-by-email', passengerController.findPassengerByEmail);
router.post('/find-passenger-by-phn-no', passengerController.findPassengerByPhoneNumber);
router.post('/update-password/:id', passengerController.updatePassword);
router.post('/forgot-password', passengerController.forgotPassword); // this api can be used for email verification as well but you must comment the purpose where u are using it, it is your resposibility
router.post('/idDeviceIdMatched/:passengerId', passengerController.idDeviceIdMatched);
router.get('/is_Passenger_Login/:passengerId', passengerController.isPassengerLogin);
router.post('/delete/:passengerId', passengerController.deletePassenger)




module.exports = router;