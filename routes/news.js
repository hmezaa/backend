var express = require('express');
var router = express.Router();
const newsController = require('../controllers/news');



router.get('/get-news-by-city/:cityName', newsController.getNews );



module.exports = router;