const http_status_codes = require('http-status-codes');
const {

    Brand
} = require('../../database/database');
module.exports = {

    async createBrand(req, res, next) {
        try {
            const {
                name                
            } = req.body;

            const brand = await Brand.create({
                name: name
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json(brand);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating Brand",
                err: err
            });
        }
    },

    async updateBrand(req, res, next) {
        try {
            const {
                name
            } = req.body;

            const brandId = req.params.id;
            const brand = await Brand.update({
                name: name
            }, {
                where: {
                    id: brandId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Brand Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating Brand",
                err: err
            });
        }
    },

    async getBrand(req, res, next) {
        try {
            const brandId = req.params.id;
            const brand = await Brand.findOne({ where: { id: brandId } });
            return res.status(http_status_codes.StatusCodes.OK).json(brand);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Brand",
                err: err
            });
        }
    },

    async getAllBrands(req, res, next) {
        try {
            const brand = await Brand.findAll({
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(brand);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Brand",
                err: err
            });
        }
    },

    async getAllBrandsDD(req, res, next) {
        try {
            const brands = await Brand.findAll({
                attributes: ['id', 'name'],
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(brands);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All City DD",
                err: err
            });
        }
    },


    async deleteBrand(req, res, next) {
        try {
            const brandId = req.params.id;
            const brand = await Brand.destroy({ where: { id: brandId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'Brand Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Brand",
                err: err
            });
        }
    }
};