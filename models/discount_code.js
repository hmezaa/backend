module.exports = (sequelize, type) => {
    return sequelize.define("discount_code", {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true
      },      
      discountCode: type.STRING,
      discountAmount: type.STRING 
    });
  };