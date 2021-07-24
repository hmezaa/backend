const Sequelize = require('sequelize');

// MODELS


const AdminModel = require("../models/admin");
const BankInfoModel = require("../models/bank_info");
const BookingModel = require("../models/booking");
const BrandModel = require("../models/brand");
const ChatModel = require("../models/chat");
const CityModel = require("../models/city");
const CityBoundryModel = require("../models/city_boundry");
// const CityBoundryLatLngModel = require("../models/city_boundry_latlng");
const ContactUsModel = require("../models/contact_us");
const ConversationModel = require("../models/conversation");
const DiscountCodeModel = require("../models/discount_code");
const DriverModel = require("../models/driver");
const DriverToUpdateModel = require("../models/driver_to_update");
const FavoriteDriverModel = require("../models/favorite_drivers");
const FeedBackModel = require("../models/feedback");
const MessageModel = require("../models/message");
const ModelModel = require("../models/model");
const NewsModel = require("../models/news");
const PassengerModel = require("../models/passenger");
const PassengerToUpdateModel = require("../models/passenger_to_update");
const PassengerPaymentMethodModel = require("../models/passenger_payment_method");
const PassengerPreferenceModel = require("../models/passenger_prefrences");
const PhoneNumberModel = require("../models/phone_number");
const PriceModel = require("../models/price");
const QueueModel = require("../models/queue");
const ReservedBookingModel = require("../models/reserved_booking");
const SavedLocationModel = require("../models/saved_location");
const VehicleModel = require("../models/vehicle");
const VehicleTypeModel = require("../models/vehicle_type");
const WithdrawModel = require("../models/withdraw");
//const AvailableModel = require("../models/available"); // Add founds && HMA
const foundsModel = require("../models/founds"); // Add founds && HMA

// SEQUELIZE CONNECTION

const sequelize = new Sequelize("fara", "root", "root1234", {
// const sequelize = new Sequelize("fara", "root", "Akfh77ja;)", {

    host: "localhost",
    dialect: "mysql",
    // operatorsAliases: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// MODELS CREATIONS WITH SWQUELIZE

const Admin = AdminModel(sequelize, Sequelize);
const BankInfo = BankInfoModel(sequelize, Sequelize);
const Booking = BookingModel(sequelize, Sequelize);
const Brand = BrandModel(sequelize, Sequelize);
const Chat = ChatModel(sequelize, Sequelize);
const City = CityModel(sequelize, Sequelize);
const CityBoundry = CityBoundryModel(sequelize, Sequelize);
const ContactUs = ContactUsModel(sequelize, Sequelize);
const Conversation = ConversationModel(sequelize, Sequelize);
const DiscountCode = DiscountCodeModel(sequelize, Sequelize);
const Driver = DriverModel(sequelize, Sequelize);
const DriverToUpdate = DriverToUpdateModel(sequelize, Sequelize);
const FavoriteDriver = FavoriteDriverModel(sequelize, Sequelize);
const FeedBack = FeedBackModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);
const Model = ModelModel(sequelize, Sequelize);
const News = NewsModel(sequelize, Sequelize);
const Passenger = PassengerModel(sequelize, Sequelize);
const PassengerToUpdate = PassengerToUpdateModel(sequelize, Sequelize);
const PassengerPaymentMethod = PassengerPaymentMethodModel(sequelize, Sequelize);
const PassengerPreference = PassengerPreferenceModel(sequelize, Sequelize);
const PhoneNumber = PhoneNumberModel(sequelize, Sequelize);
const Price = PriceModel(sequelize, Sequelize);
const Queue = QueueModel(sequelize, Sequelize);
const ReservedBooking = ReservedBookingModel(sequelize, Sequelize);
const SavedLocation = SavedLocationModel(sequelize, Sequelize);
const Vehicle = VehicleModel(sequelize, Sequelize);
const VehicleType = VehicleTypeModel(sequelize, Sequelize);
const Withdraw = WithdrawModel(sequelize, Sequelize);
//const Available = AvailableModel(sequelize, Sequelize); // Add founds - HMA.
const Founds = foundsModel(sequelize, Sequelize); // founds records - HMA.


//  RELATIONS


Vehicle.belongsTo(Model);
Model.hasMany(Vehicle);

Model.belongsTo(Brand);
Brand.hasMany(Model);

News.belongsTo(City);
City.hasMany(News);

Queue.belongsTo(Driver);
Driver.hasMany(Queue);

Queue.belongsTo(VehicleType);
VehicleType.hasMany(Queue);

DriverToUpdate.belongsTo(Driver);
Driver.hasMany(DriverToUpdate);

PassengerToUpdate.belongsTo(Passenger);
Passenger.hasMany(PassengerToUpdate);

Price.belongsTo(City);
City.hasMany(Price);

CityBoundry.belongsTo(City);
City.hasMany(CityBoundry);

FeedBack.belongsTo(Booking);
Booking.hasMany(FeedBack);

Price.belongsTo(VehicleType);
VehicleType.hasMany(Price);

PhoneNumber.belongsTo(City);
City.hasMany(PhoneNumber);

BankInfo.belongsTo(Driver);
Driver.hasMany(BankInfo);

FeedBack.belongsTo(Driver);
Driver.hasMany(FeedBack);

FeedBack.belongsTo(Passenger);
Passenger.hasMany(FeedBack);

Vehicle.belongsTo(VehicleType);
VehicleType.hasMany(Vehicle);

Withdraw.belongsTo(Driver);
Driver.hasMany(Withdraw);

Booking.belongsTo(Driver);
Driver.hasMany(Booking);

FavoriteDriver.belongsTo(Driver);
Driver.hasMany(FavoriteDriver);

FavoriteDriver.belongsTo(Passenger);
Passenger.hasMany(FavoriteDriver);

Booking.belongsTo(Passenger);
Passenger.hasMany(Booking);

PassengerPaymentMethod.belongsTo(Passenger);
Passenger.hasMany(PassengerPaymentMethod);

PassengerPreference.belongsTo(Passenger);
Passenger.hasMany(PassengerPreference);

Vehicle.belongsTo(Driver);
Driver.hasMany(Vehicle);

SavedLocation.belongsTo(Passenger);
Passenger.hasMany(SavedLocation);

ContactUs.belongsTo(Passenger);
Passenger.hasMany(ContactUs);

ContactUs.belongsTo(Driver);
Driver.hasMany(ContactUs);

ReservedBooking.belongsTo(Driver);
Driver.hasMany(ReservedBooking);

ReservedBooking.belongsTo(VehicleType);
VehicleType.hasMany(ReservedBooking);

Message.belongsTo(Conversation);
Conversation.hasMany(Message, { foreignKey: 'conversationId', sourceKey: 'id' });


//TO UPDATE SCHEMA

sequelize.sync({ alter: true }).then(() => {
    console.log(`Database & tables created!`);
});





// EXPORT MODELS

module.exports = {
    Admin,
    BankInfo,
    Booking,
    Brand,
    Chat,
    City,
    CityBoundry,
    // CityBoundryLatLng,
    ContactUs,
    Conversation,
    DiscountCode,
    Driver,
    DriverToUpdate,
    FavoriteDriver,
    FeedBack,
    Founds,
    Message,
    Model,
    News,
    Passenger,
    PassengerToUpdate,
    PassengerPaymentMethod,
    PassengerPreference,
    PhoneNumber,
    Price,
    Queue,
    ReservedBooking,
    SavedLocation,
    Vehicle,
    VehicleType,
    Withdraw
};