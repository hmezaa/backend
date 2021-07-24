var express = require('express');
var router = express.Router();
const withDrawController = require('../controllers/withdraw');


router.post('/create/:driverId', withDrawController.createWithdraw );
router.post('/pay-to-driver/:withdrawId', withDrawController.payToDriver );
router.post('/update/:withdrawId', withDrawController.updateWithdraw );
router.post('/delete/:id', withDrawController.deleteWithdraw );
router.get('/get/:withdrawId', withDrawController.getWithdraw );
router.get('/getall', withDrawController.getAllWithdraws );
router.get('/getall/:driverId', withDrawController.getWithdrawByDriver );



module.exports = router;