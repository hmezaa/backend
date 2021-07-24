var express = require('express');
var router = express.Router();
const favoriteDriverController = require('../controllers/favorite_drivers');


router.post('/create', favoriteDriverController.createFavoriteDriver );
router.post('/update/:id', favoriteDriverController.updateFavoriteDriver );
router.post('/delete/:id', favoriteDriverController.deleteFavoriteDriver );
router.get('/get/:id', favoriteDriverController.getFavoriteDriver );
router.get('/getall/:id', favoriteDriverController.getAllFavoriteDrivers );



module.exports = router;