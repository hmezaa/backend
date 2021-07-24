const http_status_codes = require('http-status-codes');
const {
   
    DiscountCode
} = require('../database/database');
module.exports = {

    async createDiscountCode(req, res, next) {
        try {
            const {
                discountCode,
                discountAmount                
            } = req.body;   

            const code = await DiscountCode.create({
                discountCode: discountCode,
                discountAmount: discountAmount               
            });

            return res.status(http_status_codes.StatusCodes.CREATED).json(code);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating createDiscountCode"
            });
        }
    },

    async updateDiscountCode(req, res, next) {
        try {
            const {
                discountCode,
                discountAmount,
                
            } = req.body;

            discountCodeId = req.params.discountCodeId;
            const code = await DiscountCode.update({
                discountAmount: discountAmount,
                discountCode: discountCode                
            }, {
                where: {
                    id: discountCodeId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'DiscountCode Updated Successfully'
            });
        } 
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating DiscountCode"
            });
        }
    },

    async getDiscountCode(req, res, next) {
        try {
            discountCodeId = req.params.discountCodeId;
            const discountCode = await DiscountCode.findOne({where: {id: discountCodeId }});
            return res.status(http_status_codes.StatusCodes.OK).json(discountCode);
        } 
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching DiscountCode"
            });
        }
    },

    async getAllDiscountCodes(req, res, next) {
        try {            
            const discountCodes = await DiscountCode.findAll();
            return res.status(http_status_codes.StatusCodes.OK).json(discountCodes);
        } 
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All DiscountCode"
            });
        }
    },


    async deleteDiscountCode(req, res, next) {
        try {    
            discountCodeId = req.params.discountCodeId;        
            const discountCode = await DiscountCode.destroy({where: {id: discountCodeId}});
            return res.status(http_status_codes.StatusCodes.OK).json({message: 'DiscountCode Deleted Successfully'});
        } 
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting DiscountCode"
            });
        }
    }
};