var express = require('express');
var router = express.Router();
const messageController = require('../controllers/message');


router.post('/sendmessage/:senderId/:receiverId', messageController.sendMessage );
router.get('/getallmessages/:senderId/:receiverId', messageController.getAllMessages );




module.exports = router;