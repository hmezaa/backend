const http_status_codes = require('http-status-codes');
const {

    Withdraw,
    Driver
} = require('../database/database');
module.exports = {

    async createWithdraw(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const {
                amount
            } = req.body;

            const withdraw = await Withdraw.create({
                amount: amount,
                driverId: driverId
            })
                .then(() => {
                    Driver.update({
                        isWithdrawRequested: true
                    }, {
                        where: {
                            id: driverId
                        }
                    })
                        .then(() => {
                            return res.status(http_status_codes.StatusCodes.CREATED).json(withdraw);
                        });
                });

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating Withdraw"
            });
        }
    },

    async payToDriver(req, res, next) {
        try {
            const {
                amount,
                driverId
            } = req.body;

            withdrawId = req.params.withdrawId;
            const withdraw = await Withdraw.findOne({ where: { id: withdrawId } });
            if (withdraw) {

                await Withdraw.update({
                    isPaid: true
                }, {
                    where: {
                        id: withdrawId
                    }
                });

                const driver = await Driver.findOne({ where: { id: driverId } });
                await Driver.update({
                    balance: (driver.balance - amount)
                }, {
                    where: {
                        id: driverId,
                        isWithdrawRequested: false
                    }
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'Withdraw Piad to Driver Successfully'
                });
            }
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in payToDriver"
            });
        }
    },

    async updateWithdraw(req, res, next) {
        try {
            const {
                amount
            } = req.body;
            withdrawId = req.params.withdrawId;
            const withdraw = await Withdraw.update({
                amount: amount
            }, {
                where: {
                    id: withdrawId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Withdraw Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating Withdraw"
            });
        }
    },

    async getWithdraw(req, res, next) {
        try {
            withdrawId = req.params.withdrawId;
            const withdraw = await Withdraw.findOne({ where: { id: withdrawId }, include: { all: true } });
            return res.status(http_status_codes.StatusCodes.OK).json(withdraw);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Withdraw"
            });
        }
    },

    async getAllWithdraws(req, res, next) {
        try {
            const withdraw = await Withdraw.findAll({ include: { all: true }, order: [['createdAt', 'DESC']], });
            return res.status(http_status_codes.StatusCodes.OK).json(withdraw);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Withdraw"
            });
        }
    },

    async getWithdrawByDriver(req, res, next) {
        try {
            driverId = req.params.driverId;
            const withdraw = await Withdraw.findAll({ order: [['createdAt', 'DESC']], where: { driverId: driverId }, include: { all: true } });
            return res.status(http_status_codes.StatusCodes.OK).json(withdraw);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Withdraw"
            });
        }
    },


    async deleteWithdraw(req, res, next) {
        try {
            withdrawId = req.params.withdrawId;
            const Withdraw = await Withdraw.destroy({ where: { id: withdrawId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'Withdraw Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Withdraw"
            });
        }
    }
};