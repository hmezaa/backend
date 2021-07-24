

  
var express = require('express');
var router = express.Router();
const discountCodeController = require('../controllers/discount_code');


router.post('/create', discountCodeController.createDiscountCode );
router.post('/update/:discountCodeId', discountCodeController.updateDiscountCode );
router.post('/delete/:discountCodeId', discountCodeController.deleteDiscountCode );
router.get('/get/:discountCodeId', discountCodeController.getdiscountCode );
router.get('/getall', discountCodeController.getAllDiscountCodes );



module.exports = router;