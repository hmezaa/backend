const http_status_codes = require('http-status-codes');
const {
    Passenger,
    PassengerToUpdate
} = require('../database/database');
module.exports = {



    async updatePassengerToUpdate(req, res, next) {
        try {
            const {
                firstName,
                lastName,
                phoneNumber,
            } = req.body;
            const passengerId = req.params.passengerId;
            await Passenger.update({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                isUpdateApproved: true,
                isUpdateDeclined: false,
            }, {
                where: {
                    id: passengerId
                }
            });
            await PassengerToUpdate.destroy({ where: { passengerId: passengerId } });

            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'passengerToUpdate Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in updatepassengerToUpdate",
                err: err
            });
        }
    },

    async getPassengerToUpdate(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const passengerToUpdate = await PassengerToUpdate.findOne({
                where: {
                    passengerId: passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(passengerToUpdate);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching passengerToUpdate"
            });
        }
    },

    async getAllPassengerToUpdates(req, res, next) {
        try {
            const passengersToUpdate = await PassengerToUpdate.findAll({
                order: [['createdAt', 'DESC']],
                include: [{
                    model: Passenger,
                    attributes: ['firstName', 'lastName', 'phoneNumber', 'image']
                }],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(passengersToUpdate);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllpassengerToUpdates",
                err: err
            });
        }
    },

    async deletePassengerToUpdate(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            await Passenger.update({
                isUpdateApproved: false,
                isUpdateDeclined: true,
            }, {
                where: {
                    id: passengerId
                }
            });
            await PassengerToUpdate.destroy({ where: { passengerId: passengerId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'passengerToUpdate Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in deletepassengerToUpdate"
            });
        }
    }
};