const http_status_codes = require('http-status-codes');
const {

    PhoneNumber, City
} = require('../../database/database');
module.exports = {

    async createPhoneNumber(req, res, next) {
        try {
            const {
                number,
                cityId
            } = req.body;
            const phoneNumber = await PhoneNumber.create({
                number: number,
                cityId: cityId
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json(phoneNumber);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating PhoneNumber",
                err: err
            });
        }
    },

    async updatePhoneNumber(req, res, next) {
        try {
            const {
                number,
                cityId
            } = req.body;

            const phoneNumberId = req.params.phoneNumberId;
            const phoneNumber = await PhoneNumber.update({
                number,
                cityId
            }, {
                where: {
                    id: phoneNumberId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'PhoneNumber Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating PhoneNumber",
                err: err
            });
        }
    },

    async getPhoneNumber(req, res, next) {
        try {
            const phoneNumberId = req.params.phoneNumberId;
            const phoneNumber = await PhoneNumber.findOne({ where: { id: phoneNumberId } });
            return res.status(http_status_codes.StatusCodes.OK).json(phoneNumber);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching PhoneNumber",
                err: err
            });
        }
    },

    async getAllPhoneNumbers(req, res, next) {
        try {
            const phoneNumbers = await PhoneNumber.findAll({
                order: [['createdAt', 'DESC']],
                include: {model: City}
            });
            return res.status(http_status_codes.StatusCodes.OK).json(phoneNumbers);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All PhoneNumber",
                err: err
            });
        }
    },


    async deletePhoneNumber(req, res, next) {
        try {
            const phoneNumberId = req.params.phoneNumberId;
            const phoneNumber = await PhoneNumber.destroy({ where: { id: phoneNumberId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'PhoneNumber Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting PhoneNumber",
                err: err
            });
        }
    }
};