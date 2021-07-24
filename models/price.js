module.exports = (sequelize, type) => {
    return sequelize.define("price", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        priceOutCity: type.STRING,
        priceInCity: type.STRING,
        priceLate1Minute: type.STRING,
        minimumKm: type.STRING,
        supply: type.STRING,
        cashBackPrecentage: type.STRING,
        freeWaitingTime: type.STRING,
        compensation: type.STRING,
        redZone: type.STRING,
    });
};