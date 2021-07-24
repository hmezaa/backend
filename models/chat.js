module.exports = (sequelize, type) => {
    return sequelize.define("chat", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        senderId: type.STRING,
        receiverId: type.STRING,
        message: type.STRING,
    });
};

