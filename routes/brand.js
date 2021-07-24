var express = require('express');
var router = express.Router();
const brandController = require('../controllers/brand');



router.get('/getall', brandController.getAllBrands );



module.exports = router;