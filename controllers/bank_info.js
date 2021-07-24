const http_status_codes = require('http-status-codes');
const {

    BankInfo
} = require('../database/database');
module.exports = {

    async createBankInfo(req, res, next) {
        try {
            const driverId = req.params.driverId;

            const {
                bankName,
                IBAN,
                swiftCode,
                branchAddress,
                branchCode
            } = req.body;

            const bankInfo = await BankInfo.findOne({ where: { driverId: driverId } });

            if (bankInfo) {

                const bankInfo = await BankInfo.update({
                    IBAN: IBAN,
                    bankName: bankName,
                    swiftCode: swiftCode,
                    branchAddress: branchAddress,
                    branchCode: branchCode,
                }, {
                    where: {
                        driverId: driverId
                    }
                });

                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'BankInfo Updated Successfully'
                });
            } else {

                const bankInfo = await BankInfo.create({
                    bankName: bankName,
                    IBAN: IBAN,
                    swiftCode: swiftCode,
                    branchAddress: branchAddress,
                    branchCode: branchCode,
                    driverId: driverId,
                });

                return res.status(http_status_codes.StatusCodes.CREATED).json(bankInfo);
            }


        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating BankInfo",
                err: err
            });
        }
    },

    async updateBankInfo(req, res, next) {
        try {
            const {
                bankName,
                IBAN,
                swiftCode,
                branchAddress,
                branchCode
            } = req.body;

            const bankInfoId = req.params.id;
            const bankInfo = await BankInfo.update({
                IBAN: IBAN,
                bankName: bankName,
                swiftCode: swiftCode,
                branchAddress: branchAddress,
                branchCode: branchCode

            }, {
                where: {
                    id: bankInfoId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'BankInfo Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating BankInfo",
                err: err
            });
        }
    },

    async getBankInfo(req, res, next) {
        try {
            const bankInfoId = req.params.id;
            const bankInfo = await BankInfo.findOne({ where: { id: bankInfoId } });
            return res.status(http_status_codes.StatusCodes.OK).json(bankInfo);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching BankInfo",
                err: err
            });
        }
    },

    async getBankInfoByDriver(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const bankInfo = await BankInfo.findOne({ where: { driverId: driverId } });
            return res.status(http_status_codes.StatusCodes.OK).json(bankInfo);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getBankInfoByDriver",
                err: err
            });
        }
    },

    async getAllBankInfos(req, res, next) {
        try {
            const bankInfo = await BankInfo.findAll();
            return res.status(http_status_codes.StatusCodes.OK).json(bankInfo);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All BankInfo",
                err: err
            });
        }
    },


    async deleteBankInfo(req, res, next) {
        try {
            const bankInfoId = req.params.id;
            const bankInfo = await BankInfo.destroy({ where: { id: bankInfoId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'BankInfo Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting BankInfo",
                err: err
            });
        }
    }
};