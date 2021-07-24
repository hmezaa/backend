// Routes
var express = require('express');
var router = express.Router();
const driverController = require('../controllers/driver');
const isAuth = require('../middleware/check-auth');

// fara now
router.post('/signup-with-phone-number', driverController.signUpWithPhoneNumber);
router.post('/signin-with-phone-number', driverController.signInWithPhoneNumber);
router.post('/find-driver-by-city', driverController.findDriverByCity);
router.post('/decline-call-order-and-find-new-driver', driverController.declineCallOrderAndFindNewDriver);
router.post('/update-driverPhoto/:driverId', driverController.updateDriverPhoto);
router.post('/update-phone/:driverId', driverController.updateDriverPhoneNumber);
router.post('/update-city/:driverId', driverController.updateDriverCity);
router.post('/rating/:driverId', driverController.rateDriver);
router.post('/get-by-phone', driverController.getByPhone);
router.get('/get-earnings-viacash/:driverId', driverController.getEarningsViaCash);
router.get('/get-earnings-viacard/:driverId', driverController.getEarningsViaCard);
router.post('/update/:driverId', driverController.updateDriver);
router.post('/approve-update/:drivertoupdateId', driverController.approveUpdateDriver);
router.post('/decline-update/:drivertoupdateId', driverController.declineUpdateDriver);
router.get('/approve-decline-status/:driverId', driverController.getStatusOfApproveOrDecline);
router.get('/false-approve-decline-status/:driverId', driverController.falseStatusOfApproveAndDecline);

// before fara
router.post('/signup', driverController.createDriver);
router.post('/signin', driverController.signinDriver);
router.post('/resetpassword/:id', driverController.resetPassword);
router.post('/delete/:driverId', driverController.deleteDriver);
router.post('/logout/:driverId', driverController.logoutDriver);
router.post('/isLogin_True/:driverId', driverController.isLogedInTrue);
router.post('/change-driver-availabiliy-status/:driverId', driverController.changeDriverAvailabiliyStatus);
router.post('/create-driver-bank-details/:driverId', driverController.createDriverBankDetails);
router.post('/update-current-location/:driverId', driverController.updateCurrentLocation);
router.post('/update-password/:id', driverController.updatePassword);
router.post('/forgot-password', driverController.forgotPassword); // this api can be used for email verification as well but you must comment the purpose where u are using it, it is your resposibility
router.post('/idDeviceIdMatched/:driverId', driverController.idDeviceIdMatched);
router.post('/find-driver-by-email', driverController.findDriverByEmail);
router.post('/find-driver-by-phn-no', driverController.findDriverByPhoneNumber);
router.get('/approve-driver/:driverId', driverController.approveDriver);
router.get('/dis-approve-driver/:driverId', driverController.disApproveDriver);
router.get('/get/:driverId', driverController.getbyId);
router.get('/get-photo/:driverId', driverController.getPhotoById);
router.get('/get-balance/:driverId', driverController.getBalanceById);
router.get('/get-rating/:driverId', driverController.getRatingById);
router.get('/get-rating-balance/:driverId', driverController.getRatingBalanceById);
router.get('/get-request-status/:driverId', driverController.getIsRequestedStatusById);
router.get('/get-availability-status/:driverId', driverController.getAvailabilityStatus);
router.get('/get-approval-status/:driverId', driverController.getApprovalStatus);
router.get('/getall', driverController.getAll);
router.get('/getallAvailableDrivers', driverController.getallAvailableDrivers);
router.get('/is_Driver_Login/:driverId', driverController.isDriverLogin);
router.get('/addmoney/:driverId', driverController.updateAvailableFounds);
router.get('/showmoney/:driverId', driverController.getAvailableFounds);

module.exports = router;