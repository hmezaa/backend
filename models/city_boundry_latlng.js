module.exports = (sequelize, type) => {
    return sequelize.define("city_boundry_latlng", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      },
      latitude: type.STRING,
      longitude: type.STRING
    });
  };