module.exports = (sequelize, type) => {
    return sequelize.define("reserved-booking", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        date: type.STRING,
        reserveCode: type.STRING,
        time: type.STRING,
        isStarted: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        isFromAdmin: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        city: type.STRING,
        currentLat: type.STRING,
        currentLng: type.STRING,
        paymentVia: type.STRING,
        destination: type.STRING,
        estTime: type.STRING,
        totalKM: type.STRING,
        journeyCost: type.STRING,
        currentAddress: type.STRING,
        passenger: type.STRING,
        passengerId: type.STRING,
        vehicleName: type.STRING,
    });
};
