module.exports = (sequelize, type) => {
    return sequelize.define("news", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      },
      title: type.STRING,
      description: type.STRING,
      image: type.STRING
    });
  };







