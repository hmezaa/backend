var express = require('express');
var router = express.Router();
const newsController = require('../controllers/dashboard/news');


router.post('/create/', newsController.createNews );
router.post('/update/:newsId', newsController.updateNews );
router.post('/delete/:newsId', newsController.deleteNews );
router.get('/get/:newsId', newsController.getNews );
router.get('/getall', newsController.getAllNews );



module.exports = router;