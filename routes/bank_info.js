var express = require('express');
var router = express.Router();
const bankInfoController = require('../controllers/bank_info');


router.post('/create/:driverId', bankInfoController.createBankInfo);
router.post('/update/:id', bankInfoController.updateBankInfo);
router.post('/delete/:id', bankInfoController.deleteBankInfo);
router.get('/get/:id', bankInfoController.getBankInfo);
router.get('/get-by-driver/:driverId', bankInfoController.getBankInfoByDriver);
router.get('/getall', bankInfoController.getAllBankInfos);



module.exports = router;