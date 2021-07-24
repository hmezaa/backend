var express = require('express');
var router = express.Router();
const feedBackController = require('../controllers/dashboard/feedback');
const isAuth = require('../middleware/check-auth');


router.get('/getall', feedBackController.getAllFeedBack);

module.exports = router;