module.exports = (sequelize, type) => {
    return sequelize.define("available", {
        available: { type: type.INTEGER }
    });
};