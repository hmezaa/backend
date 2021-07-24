const http_status_codes = require('http-status-codes');
const {
    Driver,
    Queue
} = require('../database/database');
const driver = require('../models/driver');
const sequelize = require("sequelize");
const op = sequelize.Op;
module.exports = {

    async createQueue(req, res, next) {
        try {
            const {
                vehicleTypeId,
                driverId,
                cityName
            } = req.body;

            const isQueued = await Queue.findOne({ where: { driverId: driverId } });
            if (isQueued) {
                return res.status(http_status_codes.StatusCodes.OK).json({ message: 'This driver is already in queue' });
            } else {
                const queue = await Queue.create({
                    vehicleTypeId: vehicleTypeId,
                    driverId: driverId,
                    cityName: cityName
                });
                return res.status(http_status_codes.StatusCodes.CREATED).json(queue);
            }

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating Queue",
                err: err
            });
        }
    },

    async updateQueue(req, res, next) {
        try {
            const {
                driverId
            } = req.body;

            const queueId = req.params.queueId;
            const queue = await Queue.update({
                driverId: driverId

            }, {
                where: {
                    id: queueId
                }
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Queue Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating Queue",
                err: err
            });
        }
    },

    async getQueue(req, res, next) {
        try {
            const queueId = req.params.queueId;
            const queue = await Queue.findOne({ where: { id: queueId } });
            return res.status(http_status_codes.StatusCodes.OK).json(queue);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching Queue",
                err: err
            });
        }
    },

    async getDriverFromQueue(req, res, next) {
		
        try {
            const {
                number,
                cityName,
                vehicleTypeId
            } = req.body;

            const queue = await Queue.findAll(
                {
                    where: {
                        [op.and]: [
                            {
                                cityName: cityName
                            },
                            {
                                vehicleTypeId: vehicleTypeId
                            }
                        ]
                    }
                }
            );

            if (number > queue.length) {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({ message: 'Driver does not exist on this location of Queue' });
            } else {

                let driverIndex = queue[(number - 1)];
                const driver = await Driver.findOne({ where: { id: driverIndex.driverId } });
                if (driver) {
                    return res.status(http_status_codes.StatusCodes.OK).json(driver.id);
                } else {
                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({ message: 'Driver does not exist' });
                }
            }
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Queue",
                err: err
            });
        }
    },

    async getDriverFromQueueWithoutVehicleType(req, res, next) {
        try {
            const {
                number,
                cityName
            } = req.body;

            const queue = await Queue.findAll(
                {
                    where: { cityName: cityName }
                }
            );

            if (number > queue.length) {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({ message: 'Driver does not exist on this location of Queue' });
            } else {

                let driverIndex = queue[(number - 1)];
                const driver = await Driver.findOne({ where: { id: driverIndex.driverId } });
                if (driver) {
                    return res.status(http_status_codes.StatusCodes.OK).json(driver.id);
                } else {
                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({ message: 'Driver does not exist' });
                }
            }
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Queue",
                err: err
            });
        }
    },


    async deleteQueue(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const queue = await Queue.destroy({ where: { driverId: driverId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'Queue Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Queue",
                err: err
            });
        }
    }
};