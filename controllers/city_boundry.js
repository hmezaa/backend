const http_status_codes = require('http-status-codes');
const {

    CityBoundry, City

} = require('../database/database');
module.exports = {

    async createCityBoundry(req, res, next) {
        try {
            const {
                latitude,
                longitude,
                cityId
            } = req.body;

            const cityBoundry = await CityBoundry.create({
                latitude: latitude,
                longitude: longitude,
                cityId: cityId
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json(cityBoundry);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating CityBoundry",
                err: err
            });
        }
    },
    async createBulkCityBoundry(req, res, next) {
        try {
            const {
                boundries
            } = req.body;

            await CityBoundry.bulkCreate(boundries);

            return res.status(http_status_codes.StatusCodes.CREATED).json({ message: "created Successfully" });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating CityBoundry",
                err: err
            });
        }
    },

    async updateCityBoundry(req, res, next) {
        try {

            const {
                boundries
            } = req.body;

            const cityId = req.params.cityId;

            await CityBoundry.destroy({ where: { cityId: cityId } });
            await CityBoundry.bulkCreate(boundries);
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating CityBoundry"
            });
        }
    },

    async getCityBoundry(req, res, next) {
        try {
            const cityBoundryId = req.params.id;
            const cityBoundry = await CityBoundry.findOne({ where: { id: cityBoundryId } });
            return res.status(http_status_codes.StatusCodes.OK).json(cityBoundry);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching CityBoundry",
                err: err
            });
        }
    },

    async getAllCityBoundriesByCityId(req, res, next) {
        try {
            const cityBoundries = await CityBoundry.findAll({ where: { cityId: req.params.cityId } });
            return res.status(http_status_codes.StatusCodes.OK).json(cityBoundries);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All CityBoundry",
                err: err
            });
        }
    },

    async getAllCityBoundriesByCityName(req, res, next) {
        try {
            const { cityName } = req.body;
            const city = await City.findOne({ where: { cityName: cityName } });
            if (city) {
                const cityBoundries = await CityBoundry.findAll({ where: { cityId: city.id }, attributes: ['latitude', 'longitude'] });
                return res.status(http_status_codes.StatusCodes.OK).json(cityBoundries);
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({ message: 'City Not Found' });
            }
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllCityBoundriesByCityName",
                err: err
            });
        }
    },

    async deleteCityBoundry(req, res, next) {
        try {
            const cityBoundryId = req.params.id;
            const cityBoundry = await CityBoundry.destroy({ where: { id: cityBoundryId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'CityBoundry Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting CityBoundry",
                err: err
            });
        }
    }
};