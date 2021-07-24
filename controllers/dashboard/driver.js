const http_status_codes = require('http-status-codes');
const sequelize = require("sequelize");
const op = sequelize.Op;

const {
    Driver
} = require('../../database/database');


module.exports = {

    async getAllActivatedDrivers(req, res, next) {
        try {
            const actDrivers = await Driver.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    isApproved: true
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(actDrivers);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllActivatedDrivers",
                err: err
            });
        }
    },

    async getAllBlockedDrivers(req, res, next) {
        try {
            const blkDrivers = await Driver.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    isApproved: false
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(blkDrivers);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllBlockedDrivers",
                err: err
            });
        }
    },

    async getbyId(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver",
                err: err
            })
        }
    },

    async activateDriver(req, res, next) {
        try {
            const driverId = req.params.driverId;

            Driver.update({
                isApproved: true
            }, {
                where: {
                    id: driverId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Activated Sussessfully"
            });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in activateDriver"
            })
        }
    },

    async blockDriver(req, res, next) {
        try {
            const driverId = req.params.driverId;

            Driver.update({
                isApproved: false
            }, {
                where: {
                    id: driverId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Blocked Sussessfully"
            });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in blockDriver",
                err: err
            })
        }
    },
    async searchDriver(req, res, next) {
        try {
            const driver = await Driver.findAll({
                where: {
                    [op.or]: [
                        {
                            firstName: {
                                [op.like]: '%' + req.params.name + '%'
                            }
                        },
                        {
                            lastName: {
                                [op.like]: '%' + req.params.name + '%'
                            }
                        }
                    ]
                },
                limit: 4,
                attributes: ['firstName', 'lastName', 'phoneNumber', 'driverPhoto', 'id']
            })
            return res.status(http_status_codes.StatusCodes.OK).json(driver);
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in search driver",
                err: error
            })
        }
    },
};