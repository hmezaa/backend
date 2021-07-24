module.exports = (sequelize, type) => {
    return sequelize.define("vehicle_type", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        vehicleName: type.STRING,
        image: type.STRING
    });
};







