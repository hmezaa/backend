const http_status_codes = require('http-status-codes');
const {
    Price,
    City
} = require('../database/database');
const sequelize = require("sequelize");
const op = sequelize.Op;
var geodist = require('geodist');
module.exports = {

    async createPrice(req, res, next) {
        try {
            const {
                priceInCity,
                priceOutCity,
                priceLate1Minute,
                minimumKm,
                supply,
                compensation,
                freeWaitingTime,
                cityId,
                vehicleTypeId
            } = req.body;

            const pricee = await Price.create({
                priceInCity: priceInCity,
                priceOutCity: priceOutCity,
                priceLate1Minute: priceLate1Minute,
                minimumKm: minimumKm,
                supply: supply,
                compensation: compensation,
                freeWaitingTime: freeWaitingTime,
                cityId: cityId,
                vehicleTypeId: vehicleTypeId
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json(pricee);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating Price",
                err: err
            });
        }
    },

    async updatePrice(req, res, next) {
        try {
            const {
                priceInCity,
                priceOutCity,
                priceLate1Minute,
                minimumKm,
                compensation,
                supply,
                freeWaitingTime
            } = req.body;

            const priceId = req.params.priceId;
            const pricee = await Price.update({
                priceInCity: priceInCity,
                priceOutCity: priceOutCity,
                priceLate1Minute: priceLate1Minute,
                minimumKm: minimumKm,
                compensation: compensation,
                supply: supply,
                freeWaitingTime: freeWaitingTime

            }, {
                where: {
                    id: priceId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Price Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating Price",
                err: err
            });
        }
    },

    async getPrice(req, res, next) {
        try {
            const priceId = req.params.priceId;
            const price = await Price.findOne({ where: { id: priceId } });
            return res.status(http_status_codes.StatusCodes.OK).json(price);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Price",
                err: err
            });
        }
    },

    async getPriceByCityAndVehicle(req, res, next) {
        try {
            const {
                cityName,
                vehicleTypeId
            } = req.body;

            const city = await City.findOne({ where: { cityName: cityName } });
            const price = await Price.findOne({
                where: {
                    [op.and]: [{
                        cityId: city.id
                    },
                    {
                        vehicleTypeId: vehicleTypeId
                    }
                    ]
                }
            });
            if (price) {
                return res.status(http_status_codes.StatusCodes.OK).json(price);
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({ message: 'Not Found' });
            }
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getPriceByCityAndVehicle",
                err: err
            });
        }
    },

    async getAllPrices(req, res, next) {
        try {
            const price = await Price.findAll({
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(price);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Price",
                err: err
            });
        }
    },

    async deletePrice(req, res, next) {
        try {
            const priceId = req.params.priceId;
            const price = await Price.destroy({ where: { id: priceId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'Price Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Price",
                err: err
            });
        }
    },

    async findDT(req, res, next) {
        try {

            const {
                cityCenterLatitude,
                cityCenterLongitude,
                pickUpPointLatitude,
                pickUpPointLongitude,
                dropPointLatitude,
                dropPointLongitude,
                compensation
            } = req.body;

            var cityCenterPoint = {
                lat: cityCenterLatitude,
                lon: cityCenterLongitude
            };

            var pickUpPoint = {
                lat: pickUpPointLatitude,
                lon: pickUpPointLongitude
            };

            var dropPoint = {
                lat: dropPointLatitude,
                lon: dropPointLongitude
            };

            var distFromCityCenterToPickUpPoint = geodist(cityCenterPoint, pickUpPoint, {
                format: true,
                unit: 'meters'
            });
            var distanceFromCityCenterToPickUpPoint = distFromCityCenterToPickUpPoint.substr(0, dist.indexOf(' '));

            var distFromEndTripToCityCenter = geodist(dropPoint, cityCenterPoint, {
                format: true,
                unit: 'meters'
            });
            var distanceFromEndTripToCityCenter = distFromEndTripToCityCenter.substr(0, dist.indexOf(' '));

            var tripDist = geodist(pickUpPoint, dropPoint, {
                format: true,
                unit: 'meters'
            });
            var tripDistance = tripDist.substr(0, dist.indexOf(' '));

            const DT = (distanceFromCityCenterToPickUpPoint + distanceFromEndTripToCityCenter - tripDistance) * compensation;

            return res.status(http_status_codes.StatusCodes.CREATED).json(DT);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating findDT",
                err: err
            });
        }
    },
};