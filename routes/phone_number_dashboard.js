var express = require('express');
var router = express.Router();
const phoneNumberController = require('../controllers/dashboard/phone_number');


router.post('/create', phoneNumberController.createPhoneNumber );
router.post('/update/:phoneNumberId', phoneNumberController.updatePhoneNumber );
router.post('/delete/:phoneNumberId', phoneNumberController.deletePhoneNumber );
router.get('/get/:phoneNumberId', phoneNumberController.getPhoneNumber );
router.get('/getall', phoneNumberController.getAllPhoneNumbers );



module.exports = router;