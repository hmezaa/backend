const http_status_codes = require('http-status-codes');
const {

    Vehicle
} = require('../database/database');
module.exports = {

    async createOrUpdateVehicle(req, res, next) {
        try {
            const driverId = req.params.driverId;

            const {
                frontImage,
                backImage,
                leftImage,
                rightImage,
                lisenceNumber,
                vehicleTypeId,
                vehicleNoPlate,
                modelId
            } = req.body;

            const isVehicle = await Vehicle.findOne({ where: { driverId: driverId } });
            if (isVehicle) {

                const vh = await Vehicle.update({
                    vehicleTypeId: vehicleTypeId,
                    frontImage: frontImage,
                    backImage: backImage,
                    leftImage: leftImage,
                    rightImage: rightImage,
                    lisenceNumber: lisenceNumber,
                    vehicleNoPlate: vehicleNoPlate,
                    modelId: modelId
                }, {
                    where: {
                        driverId: driverId
                    }
                })
                    .then(async () => {
                        const updatedVehicle = await Vehicle.findOne({
                            where: {
                                driverId: driverId
                            },
                            include: {
                                all: true
                            }
                        })

                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Vehile is updated successfully",
                            vehicle: updatedVehicle
                        });
                    });


            } else {

                const vehicle = await Vehicle.create({
                    vehicleTypeId: vehicleTypeId,
                    driverId: driverId,
                    frontImage: frontImage,
                    backImage: backImage,
                    leftImage: leftImage,
                    rightImage: rightImage,
                    lisenceNumber: lisenceNumber,
                    vehicleNoPlate: vehicleNoPlate,
                    modelId: modelId
                });
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "Vehile is created successfully",
                    vehicle: vehicle
                });
            }

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating createVehicle"
            });
        }
    },

    async updateVehicle(req, res, next) {
        try {
            const {
                frontImage,
                backImage,
                leftImage,
                rightImage,
                lisenceNumber,
                vehicleTypeId,
                brandId
            } = req.body;

            const vehicleId = req.params.id;

            Vehicle.update({
                vehicleTypeId: vehicleTypeId,
                frontImage: frontImage,
                backImage: backImage,
                leftImage: leftImage,
                rightImage: rightImage,
                lisenceNumber: lisenceNumber,
                brandId: brandId

            }, {
                where: {
                    id: vehicleId
                }
            })
                .then(() => {
                    Vehicle.findByPk(vehicleId).then(vehicleObj => {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: 'Vehicle Updated Successfully',
                            vehicle: vehicleObj
                        });
                    })
                });

        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating updateVehicle"
            });
        }
    },

    async getVehicle(req, res, next) {
        try {
            const vehicleId = req.params.id;
            const vehicle = await Vehicle.findOne({ where: { id: vehicleId } });
            return res.status(http_status_codes.StatusCodes.OK).json(vehicle);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getVehicle"
            });
        }
    },

    async getVehicleByDriver(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const vehicle = await Vehicle.findOne({
                where:
                {
                    driverId: driverId
                },
                include: {
                    all: true
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({ vehicleByDriver: vehicle });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getVehicleByDriver"
            });
        }
    },

    async getAllVehicles(req, res, next) {
        try {
            const vehicles = await Vehicle.findAll({ order: [['createdAt', 'DESC']], });
            return res.status(http_status_codes.StatusCodes.OK).json(vehicles);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllVehicles"
            });
        }
    },


    async deleteVehicle(req, res, next) {
        try {
            const vehicleId = req.params.id;
            const vehicle = await Vehicle.destroy({ where: { id: vehicleId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'Vehicle Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Vehicle"
            });
        }
    }
};