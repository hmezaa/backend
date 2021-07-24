var express = require('express');
var router = express.Router();
const passengerPaymentMethodController = require('../controllers/passenger_payment_method');


router.post('/create/:passengerId', passengerPaymentMethodController.createPassengerPaymentMethod );
router.post('/update/:passengerPaymentMethodId', passengerPaymentMethodController.updatePassengerPaymentMethod );
router.post('/delete/:passengerPaymentMethodId', passengerPaymentMethodController.deletePassengerPaymentMethod );
router.get('/get/:passengerPaymentMethodId', passengerPaymentMethodController.getPassengerPaymentMethod );
router.get('/getall', passengerPaymentMethodController.getAllPassengerPaymentMethods );
router.get('/getall-by-passenger/:passengerId', passengerPaymentMethodController.getAllPassengerPaymentMethodsByPassenger );



module.exports = router;