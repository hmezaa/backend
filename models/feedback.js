module.exports = (sequelize, type) => {
    return sequelize.define("feedback", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        feedback: type.STRING,
        rating: {
            type: type.DOUBLE,
            defaultValue: 0
        }
    });
};