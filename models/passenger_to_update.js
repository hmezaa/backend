module.exports = (sequelize, type) => {
    return sequelize.define("passenger_to_update", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      },
      firstName: type.STRING,
      lastName: type.STRING,
      phoneNumber: type.STRING
    });
  };