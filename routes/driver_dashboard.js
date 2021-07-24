var express = require('express');
var router = express.Router();
const driverController = require('../controllers/dashboard/driver');



router.get('/getall-active', driverController.getAllActivatedDrivers);
router.get('/getall-block', driverController.getAllBlockedDrivers);
router.get('/get/:driverId', driverController.getbyId);
router.get('/activate/:driverId', driverController.activateDriver);
router.get('/block/:driverId', driverController.blockDriver);
router.get('/search-driver/:name', driverController.searchDriver);

module.exports = router;