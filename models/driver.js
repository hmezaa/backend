//Models
module.exports = (sequelize, type) => {
  return sequelize.define("driver", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      required: true
    },
    firstName: type.STRING,
    lastName: type.STRING,
    phoneNumber: type.STRING,
    driverPhoto: type.STRING,
    address: type.STRING,
    postalCode: type.STRING,
    city: type.STRING,
    currentLat: type.STRING,
    currentLng: type.STRING,
    rating_no: {
      type: type.DOUBLE,
      defaultValue: 0
    },
    rating: {
      type: type.DOUBLE,
      defaultValue: 0
    },
    earningsviacash: {
      type: type.INTEGER,
      defaultValue: 0
    },
    earningsviacard: {
      type: type.INTEGER,
      defaultValue: 0
    },
    available: { // Available founds - HMA
      type: type.INTEGER,
      defaultValue: 0
    }, // Available founds - HMA    
    isApproved: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    driverAvailability: {
      type: type.BOOLEAN,
      defaultValue: true
    },
    isWithdrawRequested: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    isUpdateDeclined: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    isUpdateApproved: {
      type: type.BOOLEAN,
      defaultValue: false
    },
  });
};

