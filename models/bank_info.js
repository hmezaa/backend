module.exports = (sequelize, type) => {
    return sequelize.define("bank_info", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        bankName: type.STRING,
        IBAN: type.STRING,
        swiftCode: type.STRING,
        branchAddress: type.STRING,
        branchCode: type.STRING,
    });
};
