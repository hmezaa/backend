module.exports = (sequelize, type) => {
    return sequelize.define("city_boundry", {
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