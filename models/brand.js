module.exports = (sequelize, type) => {
    return sequelize.define("brand", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        name: type.STRING
    });
};
