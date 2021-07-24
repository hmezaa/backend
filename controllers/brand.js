const http_status_codes = require('http-status-codes');
const {

    Brand
} = require('../database/database');
module.exports = {



    async getAllBrands(req, res, next) {
        try {
            const brand = await Brand.findAll(
                { order: [['createdAt', 'DESC']], }
            );
            return res.status(http_status_codes.StatusCodes.OK).json(brand);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Brand",
                err: err
            });
        }
    },



};