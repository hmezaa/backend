var express = require('express');
var router = express.Router();
const contacUsController = require('../controllers/contact_us');


router.post('/create', contacUsController.createContactUs );
router.post('/update/:id', contacUsController.updateContactUs );
router.post('/delete/:id', contacUsController.deleteContactUs );
router.get('/get/:id', contacUsController.getContactUs );
router.get('/get/:passengerId', contacUsController.getContactUsByPassenger );
router.get('/get/:driverId', contacUsController.getContactUsByDriver );
router.get('/getall-by-driver', contacUsController.getAllContactUssByDriver );
router.get('/getall-by-passenger', contacUsController.getAllContactUssByPassenger );
router.get('/getall', contacUsController.getAllContactUss );



module.exports = router;