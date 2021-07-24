const http_status_codes = require('http-status-codes');

const {
    Price, City, VehicleType
} = require('../../database/database');
const {
    Template
} = require('ejs');

module.exports = {
    async getAllPrices(req, res, next) {
        try {
            const price = await Price.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: City,
                        attributes: ['cityName']
                    },
                    {
                        model: VehicleType,
                        attributes: ['vehicleName']
                    }
                ]
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
                vehicleTypeId,
                redZone
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
                vehicleTypeId: vehicleTypeId,
                redZone: redZone
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
                freeWaitingTime,
                cityId,
                vehicleTypeId,
                redZone
            } = req.body;
         

            const priceId = req.params.priceId;
            const pricee = await Price.update({
                priceInCity: priceInCity,
                priceOutCity: priceOutCity,
                priceLate1Minute: priceLate1Minute,
                minimumKm: minimumKm,
                compensation: compensation,
                supply: supply,
                freeWaitingTime: freeWaitingTime,
                cityId: cityId,
                vehicleTypeId: vehicleTypeId,
                redZone: redZone

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

};