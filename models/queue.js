module.exports = (sequelize, type) => {
    return sequelize.define("queue", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        cityName: type.STRING
    });
};