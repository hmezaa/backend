const http_status_codes = require('http-status-codes');

const {
   VehicleType
} = require('../../database/database');
const {
    Template
} = require('ejs');

module.exports = {
   
    async getAllVehicleTypesDD(req, res, next) {
        try {
            const vehicleTypes = await VehicleType.findAll({
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'vehicleName']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(vehicleTypes);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllVehicleTypesDD",
                err: err
            });
        }
    },

};