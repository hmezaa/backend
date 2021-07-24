const http_status_codes = require('http-status-codes');
const {

    Model, Brand
} = require('../../database/database');
module.exports = {

    async createModel(req, res, next) {
        try {
            const {
                name,
                year,
                brandId
            } = req.body;
            const model = await Model.create({
                name: name,
                year: year,
                brandId: brandId
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json(model);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating Model",
                err: err
            });
        }
    },

    async updateModel(req, res, next) {
        try {
            const {
                name,
                year,
                brandId
            } = req.body;

            const modelId = req.params.id;
            const model = await Model.update({
                name: name,
                year: year,
                brandId: brandId
            }, {
                where: {
                    id: modelId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Model Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating Model",
                err: err
            });
        }
    },

    async getModel(req, res, next) {
        try {
            const modelId = req.params.id;
            const model = await Model.findOne({ where: { id: modelId } });
            return res.status(http_status_codes.StatusCodes.OK).json(model);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Model",
                err: err
            });
        }
    },

    async getModelByBrandId(req, res, next) {
        try {
            const brandId = req.params.brandId;
            const model = await Model.findAll({ order: [['createdAt', 'DESC']], where: { id: brandId } });
            return res.status(http_status_codes.StatusCodes.OK).json(model);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Model",
                err: err
            });
        }
    },


    async getAllModels(req, res, next) {
        try {
            const model = await Model.findAll({ order: [['createdAt', 'DESC']], include: { model: Brand, attributes: ['name'] } });
            return res.status(http_status_codes.StatusCodes.OK).json(model);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Model",
                err: err
            });
        }
    },


    async deleteModel(req, res, next) {
        try {
            const modelId = req.params.id;
            const model = await Model.destroy({ where: { id: modelId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'Model Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Model",
                err: err
            });
        }
    }
};