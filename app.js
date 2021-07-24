var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var bodyParser = require('body-parser');

const sequelize = require('./database/database');

// CUSTOM ROUTERS
var indexRouter = require('./routes/index');
var bookingRouter = require('./routes/booking');
var bookingDashboardRouter = require('./routes/booking_dashboard');
var brandDashboardRouter = require('./routes/brand_dashboard');
var brandRouter = require('./routes/brand');
var adminRouter = require('./routes/admin');
var chatRouter = require('./routes/message');
var cityRouter = require('./routes/city');
var cityDashboardRouter = require('./routes/city_dsashboard');
var cityBoundryRouter = require('./routes/city_boundry');
var contactUsRouter = require('./routes/contact_us');
var dashboardRouter = require('./routes/dashboard');
var driverRouter = require('./routes/driver');
var driverDashboardRouter = require('./routes/driver_dashboard');
var driverToUpdateRouter = require('./routes/driver_to_update');
var favoriteDriverRouter = require('./routes/favorite_drivers');
var feedBackRouter = require('./routes/feedback_dashboard');
var imageRouter = require('./routes/image');
var modelDashboardRouter = require('./routes/model_dashboard');
var newsRouter = require('./routes/news');
var newsDashboardRouter = require('./routes/news_dashboard');
var passengerRouter = require('./routes/passenger');
var passengerToUpdateRouter = require('./routes/passenger_to_update');
var passengerDashboardRouter = require('./routes/passenger_dashboard');
var passengerPrefrenceRouter = require('./routes/passenger_prefrences');
var passengerPaymentRouter = require('./routes/passenger_payment_method');
var phoneNumberRouter = require('./routes/phone_number');
var phoneNumberDashboardRouter = require('./routes/phone_number_dashboard');
var priceRouter = require('./routes/price');
var priceDashboardRouter = require('./routes/price_dashboard');
var queueRouter = require('./routes/queue');
var savedLocationRouter = require('./routes/saved_location');
var vehicleRouter = require('./routes/vehicle');
var vehicleDashboardRouter = require('./routes/vehicle_dashboard');
var vehicleTypeRouter = require('./routes/vehicle_type');
var vehicleTypeDashboardRouter = require('./routes/vehicle_type_dashboard');
var withdrawRouter = require('./routes/withdraw');
var bankInfoRouter = require('./routes/bank_info');
var HeliViewRouter = require('./routes/heliview');




var app = express();
app.use(cors());

// view engine setup
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/images'));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  res.setHeader(
    "Version",
    "0.00"
  );
  next();
});


// CUSTOM ROUTES
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/booking', bookingRouter);
app.use('/booking-dashboard', bookingDashboardRouter);
app.use('/brand', brandRouter);
app.use('/brand-dashboard', brandDashboardRouter);
app.use('/chat', chatRouter);
app.use('/city', cityRouter);
app.use('/city-dashboard', cityDashboardRouter);
app.use('/cityBoundry', cityBoundryRouter);
app.use('/contact-us', contactUsRouter);
app.use('/dashboard', dashboardRouter);
app.use('/driver', driverRouter);
app.use('/driver-dashboard', driverDashboardRouter);
app.use('/driver-to-update', driverToUpdateRouter);
app.use('/favorite-driver', favoriteDriverRouter);
app.use('/feedback-dashboard', feedBackRouter);
app.use('/image', imageRouter);
app.use('/model-dashboard', modelDashboardRouter);
app.use('/news', newsRouter);
app.use('/news-dashboard', newsDashboardRouter);
app.use('/passenger', passengerRouter);
app.use('/passenger-to-update', passengerToUpdateRouter);
app.use('/passenger-dashboard', passengerDashboardRouter);
app.use('/passenger-prefrence', passengerPrefrenceRouter);
app.use('/passenger-payment', passengerPaymentRouter);
app.use('/phone-number', phoneNumberRouter);
app.use('/phone-number-dashboard', phoneNumberDashboardRouter);
app.use('/price', priceRouter);
app.use('/price-dashboard', priceDashboardRouter);
app.use('/queue', queueRouter);
app.use('/saved-location', savedLocationRouter);
app.use('/vehicle', vehicleRouter);
app.use('/vehicle-dashboard', vehicleDashboardRouter);
app.use('/vehicle-type', vehicleTypeRouter);
app.use('/vehicle-type-dashboard', vehicleTypeDashboardRouter);
app.use('/withdraw', withdrawRouter);
app.use('/bank-info', bankInfoRouter);
app.use('/heliview', HeliViewRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
