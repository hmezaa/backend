var express = require('express');
var router = express.Router();
var multer = require('multer');
var stripe = require("stripe")("sk_test_51HLAFHB5y7suhLHjFTXDjPdNWqSpamoEfi2RDVChi79X2X5QvJRXjF0pS211x60YjT4CvuvgYpuEmHi0MzSIxbMa00fRmQlyzB");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/imageUpload", function (req, res) {
  upload(req, res, function (err) {
    var image = req.file.filename;
    res.json(image)
    // Everything went fine.
  })
})

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './images/')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
  }
});
var upload = multer({
  storage: storage
}).single('file');

// strip strip strip


router.post("/console", (req, res) => {
  // console.log(req.body.data);
  res.json('ok')
});


var stripe = require("stripe")("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");

router.post("/charge", (req, res) => {
  // console.log('------------------', req.body, '-----------------')
  var token = req.body.token;
  var amount = req.body.amount;
  fun();
  function fun() {
    const charge = stripe.charges.create({
      source: token,
      amount: amount,
      currency: 'eur',
    }, function (err, charge) {
      // asynchronously called
      console.log(err, charge);
      res.json({ data: charge, err: err })
    })
  }
})
module.exports = router;