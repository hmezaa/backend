module.exports = (sequelize, type) => {
  return sequelize.define("passenger", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      required: true
    },
    firstName: type.STRING,
    lastName: type.STRING,
    image: type.STRING,
    email: type.STRING,
    phoneNumber: type.STRING,
    bonusAmount: type.STRING,
    currentLat: type.STRING,
    currentLng: type.STRING,
    city: type.STRING,
    address: type.STRING,
    postalCode: type.STRING,
    anonymousId: type.STRING,
    prefferedVehivleTypeId: {
      type: type.STRING,
      defaultValue: 0
    },
    isAnonymous: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    passengerAvailability: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: type.BOOLEAN,
      defaultValue: true
    }, isUpdateDeclined: {
      type: type.BOOLEAN,
      defaultValue: false
    },
    isUpdateApproved: {
      type: type.BOOLEAN,
      defaultValue: false
    },
  });
};




