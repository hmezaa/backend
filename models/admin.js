module.exports = (sequelize, type) => {
  return sequelize.define("admin", {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      required: true
    },
    adminName: type.STRING,
    email: type.STRING,
    password: type.STRING,
    isSuperAdmin: {
      type: type.BOOLEAN,
      defaultValue: false
    },
  });
};