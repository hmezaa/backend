const http_status_codes = require('http-status-codes');
const {
    VehicleType,
    City,
    Price
} = require('../database/database');
module.exports = {

    async createVehicleType(req, res, next) {
        try {
            const {
                vehicleName,
                supply,
                priceByCity,
                priceInCity,
                priceLate1Minute,
                vehicleNoPlate,
                cashBackPrecentage,
                radius,
                image,
                cityId
            } = req.body;

            const vehicleType = await VehicleType.create({
                vehicleName: vehicleName,
                supply: supply,
                priceByCity: priceByCity,
                priceInCity: priceInCity,
                priceLate1Minute: priceLate1Minute,
                vehicleNoPlate: vehicleNoPlate,
                cashBackPrecentage: cashBackPrecentage,
                radius: radius,
                image: image,
                cityId: cityId
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json(vehicleType);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in Creating VehicleType",
                errorDetails: err
            });
        }
    },

    async updateVehicleType(req, res, next) {
        try {
            const {
                vehicleName,
                supply,
                priceByCity,
                priceInCity,
                priceLate1Minute,
                vehicleNoPlate,
                cashBackPrecentage,
                radius,
                image,
                cityId
            } = req.body;
            vehicleTypeId = req.params.id;
            const vehicleType = await VehicleType.update({
                vehicleName: vehicleName,
                supply: supply,
                priceByCity: priceByCity,
                priceInCity: priceInCity,
                priceLate1Minute: priceLate1Minute,
                vehicleNoPlate: vehicleNoPlate,
                cashBackPrecentage: cashBackPrecentage,
                radius: radius,
                image: image,
                cityId: cityId

            }, {
                where: {
                    id: vehicleTypeId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'VehicleType Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in Updating VehicleType",
                errorDetails: err
            });
        }
    },

    async getVehicleType(req, res, next) {
        try {
            vehicleTypeId = req.params.id;
            const vehicleType = await VehicleType.findOne({ where: { id: vehicleTypeId } });
            return res.status(http_status_codes.StatusCodes.OK).json(vehicleType);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in Fetching VehicleType",
                errorDetails: err
            });
        }
    },

    async getAllVehicleTypes(req, res, next) {
        try {
            const vehicleTypes = await VehicleType.findAll({
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(vehicleTypes);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in Fetching All VehicleType",
                errorDetails: err
            });
        }
    },

    async getAllVehicleTypesByCity(req, res, next) {
        try {
            const { cityName } = req.body;
            const city = await City.findOne({ where: { cityName: cityName } });
            const vehicleTypesByCity = await Price.findAll({ where: { cityId: city.id }, include: { model: VehicleType }, order: [['createdAt', 'DESC']], });
            return res.status(http_status_codes.StatusCodes.OK).json(vehicleTypesByCity);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in Fetching All getAllVehicleTypesByCity",
                errorDetails: err
            });
        }
    },


    async deleteVehicleType(req, res, next) {
        try {
            vehicleTypeId = req.params.id;
            const vehicleType = await VehicleType.destroy({ where: { id: vehicleTypeId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'VehicleType Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in Deleting VehicleType",
                errorDetails: err
            });
        }
    }
};