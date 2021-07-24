module.exports = (sequelize, type) => {
    return sequelize.define("favorite_driver", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      }
    });
  };