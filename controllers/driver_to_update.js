const http_status_codes = require('http-status-codes');
const {
    Driver,
    DriverToUpdate
} = require('../database/database');
module.exports = {


    async updateDriverToUpdate(req, res, next) {
        try {
            const {
                firstName,
                lastName,
                phoneNumber
            } = req.body;
            const driverId = req.params.driverId;
            await Driver.update({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                isUpdateApproved: true,
                isUpdateDeclined: false,
            }, {
                where: {
                    id: driverId
                }
            });
            await DriverToUpdate.destroy({ where: { driverId: driverId } });

            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'DriverToUpdate Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in updateDriverToUpdate",
                err: err
            });
        }
    },
    async deleteDriverToUpdate(req, res, next) {
        try {
            const driverId = req.params.driverId;
            await Driver.update({
                isUpdateApproved: false,
                isUpdateDeclined: true,
            }, {
                where: {
                    id: driverId
                }
            });
            await DriverToUpdate.destroy({ where: { driverId: driverId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'DriverToUpdate Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in deleteDriverToUpdate"
            });
        }
    },

    async getDriverToUpdate(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const driverToUpdate = await DriverToUpdate.findOne({ where: { driverId: driverId } });
            return res.status(http_status_codes.StatusCodes.OK).json(driverToUpdate);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching DriverToUpdate"
            });
        }
    },

    async getAllDriverToUpdates(req, res, next) {
        try {

            const driversToUpdate = await DriverToUpdate.findAll({
                order: [['createdAt', 'DESC']],
                include: [{
                    model: Driver,
                    attributes: ['firstName', 'lastName', 'phoneNumber', 'driverPhoto']
                }],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driversToUpdate);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllDriverToUpdates",
                err: err
            });
        }
    },



};