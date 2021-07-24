var express = require('express');
var router = express.Router();
const bookingController = require('../controllers/dashboard/booking');
const isAuth = require('../middleware/check-auth');


router.get('/getall-customer-bookings/:passengerId', bookingController.getAllCustomerBookings);
router.get('/getall-driver-bookings/:driverId', bookingController.getAllDriverBookings);
router.get('/getall-bookings', bookingController.getAllBookings);
router.get('/getall-scheduled-bookings', bookingController.getAllScheduledBookings);
router.get('/get-scheduled-booking/:bookingId', bookingController.getScheduledBookingById);
router.get('/getall-cancelled-bookings', bookingController.getAllCancelledBookings);
router.get('/getall-completed-bookings', bookingController.getAllCompletedBookings);
router.get('/get/:bookingId', bookingController.getById);


module.exports = router;