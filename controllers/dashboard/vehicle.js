const http_status_codes = require('http-status-codes');
const {
    Driver,
    Vehicle,
    VehicleType,
    Model
} = require('../../database/database');
module.exports = {

    async getAllVehicles(req, res, next) {
        try {
            const vehicles = await Vehicle.findAll(
                {
                    order: [['createdAt', 'DESC']],
                    include: [
                        { model: Driver, attributes: ['firstName'] },
                        { model: VehicleType, attributes: ['vehicleName'] },
                        { model: Model, attributes: ['name'] },
                    ]
                }
            );
            return res.status(http_status_codes.StatusCodes.OK).json(vehicles);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllVehicles"
            });
        }
    }
};