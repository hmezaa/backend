module.exports = (sequelize, type) => {
    return sequelize.define("booking", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        pickup: type.STRING,
        destination: type.STRING,
        pickDateTime: type.STRING,
        endTripTime: type.STRING,
        status: type.STRING,
        cancellReason: type.STRING,
        cancelledBy: type.STRING,
        journeyCost: type.STRING,
        paymentVia: type.STRING,
        endingSpeed: type.STRING,
        bookingUniqueId: type.STRING,
        voiceOrder: type.STRING
    });
};
