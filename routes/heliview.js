var express = require('express');
var router = express.Router();
const HeliViewController = require('../controllers/dashboard/heliview');


router.get('/get-all-markers-for-heli', HeliViewController.getAllMarkersOfHeliView);



module.exports = router;