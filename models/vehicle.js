module.exports = (sequelize, type) => {
    return sequelize.define("vehicle", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        frontImage: type.STRING,
        backImage: type.STRING,
        leftImage: type.STRING,
        rightImage: type.STRING,
        lisenceNumber: type.STRING,
        vehicleNoPlate: type.STRING,
    });

};

