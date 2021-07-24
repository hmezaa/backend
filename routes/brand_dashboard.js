var express = require('express');
var router = express.Router();
const brandController = require('../controllers/dashboard/brand');


router.post('/create', brandController.createBrand );
router.post('/update/:id', brandController.updateBrand );
router.post('/delete/:id', brandController.deleteBrand );
router.get('/get/:id', brandController.getBrand );
router.get('/getall', brandController.getAllBrands );
router.get('/getall-brand-dd', brandController.getAllBrandsDD);




module.exports = router;