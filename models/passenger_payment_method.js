module.exports = (sequelize, type) => {
    return sequelize.define("passenger_payment_method", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        number: type.STRING,
        holder_name: type.STRING,
        expMonth: type.STRING,
        expYear: type.STRING,
        cvc: type.STRING, 
    });
};

