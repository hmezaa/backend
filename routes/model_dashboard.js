var express = require('express');
var router = express.Router();
const modelController = require('../controllers/dashboard/model');


router.post('/create', modelController.createModel);
router.post('/update/:id', modelController.updateModel);
router.post('/delete/:id', modelController.deleteModel);
router.get('/get/:id', modelController.getModel);
router.get('/get-by-brandId/:brandId', modelController.getModelByBrandId);
router.get('/getall', modelController.getAllModels);



module.exports = router;