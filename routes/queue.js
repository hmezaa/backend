var express = require('express');
var router = express.Router();
const queueController = require('../controllers/queue');


router.post('/create', queueController.createQueue );
router.post('/update/:queueId', queueController.updateQueue );
router.post('/delete/:driverId', queueController.deleteQueue );
router.get('/get/:queueId', queueController.getQueue );
router.post('/get-driver-from-queue', queueController.getDriverFromQueue );
router.post('/get-driver-from-queue-without-vehicleType', queueController.getDriverFromQueueWithoutVehicleType );



module.exports = router;