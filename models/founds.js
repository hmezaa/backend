//Models
module.exports = (sequelize, type) => {
    return sequelize.define("founds", {
       id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
      },
      idDriver: type.INTEGER,
      idPassanger: type.INTEGER,
      date: type.DATE,
      Method: type.STRING,
      amount: type.INTEGER,
      idPayment: type.STRING,
      isConfirmed: type.BOOLEAN
    });
}
      