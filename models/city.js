module.exports = (sequelize, type) => {
  return sequelize.define("city", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      required: true
    },
    cityName: type.STRING,
    cityCenterName: type.STRING,
    cityCenterLatitude: type.STRING,
    cityCenterLongitude: type.STRING,
  });
};