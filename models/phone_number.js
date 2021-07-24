module.exports = (sequelize, type) => {
    return sequelize.define("phone_number", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      },
      number: type.STRING
    });
  };