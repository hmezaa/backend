var express = require('express');
var router = express.Router();
const bookingController = require('../controllers/booking');

// fara now

router.post('/reserve', bookingController.reserveBooking);
router.post('/create', bookingController.createBooking);


// before fara


router.get('/change-status/:reservedId', bookingController.changeStatus);
router.get('/getall-driver-bookings/:driverId/:offset', bookingController.getAllDriverBookings);
router.get('/getall-driver-reserved-bookings/:driverId', bookingController.getAllDriverReserveBookings);
router.get('/getall-customer-reserved-bookings/:passengerId', bookingController.getAllCustomerReserveBookings);
router.get('/getall-customer-bookings/:passengerId', bookingController.getallBookingsOfCustomer);
router.get('/getall-driver-bookings/:driverId', bookingController.getallBookingsOfDriver);
router.get('/getall-customer-bookings/:passengerId/:offset', bookingController.getallCustomerBookings);
router.get('/getall-bookings', bookingController.getAllBookings);
router.get('/getall-reserved-bookings-by-passenger/:passengerId', bookingController.getAllReservedBookingsByPassenger);
router.get('/getall-reserved-bookings-by-driver/:driverId', bookingController.getAllReservedBookingsDriver);
router.post('/get-started-reserved-by-driver/:driverId', bookingController.getStartedReservedBookingByDriver);
router.post('/get-started-reserved-by-passenger/:passengerId', bookingController.getStartedReservedBookingByPassenger);
router.post('/calculate-estimated-price', bookingController.calculateEstimatedPrice);
router.post('/find-nearby-drivers', bookingController.findNearByDrivers);
router.post('/delete/:reservedId', bookingController.deleteReserved);
router.post('/get-by-reserved-code', bookingController.getByReservedCode);




module.exports = router;