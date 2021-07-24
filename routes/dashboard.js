var express = require('express');
var router = express.Router();
const dashboardController = require('../controllers/dashboard/dashboard');
const isAuth = require('../middleware/check-auth');


router.get('/getall-stats', dashboardController.getAllDashboardStas);


module.exports = router;