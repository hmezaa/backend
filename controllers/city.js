const http_status_codes = require('http-status-codes');
const {

    City, PhoneNumber
} = require('../database/database');
const sequelize = require("sequelize");
module.exports = {

    async createCity(req, res, next) {
        try {
            const {
                cityName,
                cityCenterName,
                cityCenterLatitude,
                cityCenterLongitude,
            } = req.body;

            const city = await City.create({
                cityName: cityName,
                cityCenterName: cityCenterName,
                cityCenterLatitude: cityCenterLatitude,
                cityCenterLongitude: cityCenterLongitude,
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json(city);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating City",
                err: err
            });
        }
    },

    async updateCity(req, res, next) {
        try {
            const {
                cityName,
                cityCenterName,
                cityCenterLatitude,
                cityCenterLongitude,
            } = req.body;

            const cityId = req.params.cityId;
            const city = await City.update({
                cityName: cityName,
                cityCenterName: cityCenterName,
                cityCenterLatitude: cityCenterLatitude,
                cityCenterLongitude: cityCenterLongitude,

            }, {
                where: {
                    id: cityId
                }
            });
            return res.status(http_status_codes.OK).json({
                message: 'City Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating City",
                err: err
            });
        }
    },

    async getCity(req, res, next) {
        try {
            const cityId = req.params.cityId;

            const city = await City.findOne({ where: { id: cityId } });
            return res.status(http_status_codes.StatusCodes.OK).json(city);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching City",
                err: err
            });
        }
    },

    async getAllCities(req, res, next) {
        try {
            const cities = await City.findAll(
                {
                    order: [['createdAt', 'DESC']],
                }
            );
            return res.status(http_status_codes.StatusCodes.OK).json(cities);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All City",
                err: err
            });
        }
    },

    async getRandomPhoneNumberByCity(req, res, next) {
        try {
            const { cityName } = req.body;

            const phones = await City.findOne({ where: { cityName: cityName }, include: { model: PhoneNumber, order: sequelize.literal('rand()'), limit: 1 } });
            return res.status(http_status_codes.StatusCodes.OK).json(phones);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllPhoneNumbersByCity",
                err: err
            });
        }
    },


    async deleteCity(req, res, next) {
        try {
            const cityId = req.params.cityId;
            const city = await City.destroy({ where: { id: cityId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'City Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting City"
            });
        }
    }
};