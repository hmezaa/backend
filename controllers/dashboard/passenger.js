const http_status_codes = require('http-status-codes');
const sequelize = require("sequelize");
const op = sequelize.Op;
const {
    Passenger
} = require('../../database/database');
const {
    Template
} = require('ejs');

module.exports = {

    async getAllActivatedPassengers(req, res, next) {
        try {
            const actPassengers = await Passenger.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    isActive: true
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(actPassengers);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllActivatedPassengers",
                err,
                err
            });
        }
    },

    async getAllBlockedPassengers(req, res, next) {
        try {
            const blkPassengers = await Passenger.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    isActive: false
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(blkPassengers);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllBlockedPassengers"
            });
        }
    },

    async signUpWithPhoneNumber(req, res, next) {

        try {
            const {
                firstName,
                lastName,
                phoneNumber,
                city,
                address,
                postalCode,
                currentLat,
                currentLng,
                bonusAmount
            } = req.body;


            Passenger.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            }).then(isPassengerExist => {
                if (isPassengerExist) {
                    res.json({
                        error: "This Passenger already exists with this phone number"
                    });
                } else {
                    Passenger.create({
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        address: address,
                        city: city,
                        postalCode: postalCode,
                        currentLat: currentLat,
                        currentLng: currentLng,
                        isAnonymous: false,
                        bonusAmount: bonusAmount
                    })
                        .then((passenger) => {
                            PassengerPreference.create({
                                call: 'Do not call under any circumstances',
                                airCondition: 'Off',
                                openDoor: 'No',
                                conversation: 'I prefer silence',
                                passengerId: passenger.id
                            }).then((passengerPreferences) => {
                                return res.status(http_status_codes.StatusCodes.CREATED).json({
                                    message: 'Passenger is Created Successfully',
                                    passenger: passenger
                                });
                            })
                        });
                }
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in signUpWithPhoneNumber",
                errorDetails: err
            });
        }
    },

    async updatePassenger(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const {
                firstName,
                lastName,
                phoneNumber
            } = req.body
            const isRequestedAlready = await PassengerToUpdate.findOne({ where: { passengerId: passengerId } });
            if (isRequestedAlready) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "Request to update is already recorded and pending for approval"
                });
            } else {
                const passengerToUpdate = await PassengerToUpdate.create({
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    passengerId: passengerId
                });
                if (passengerToUpdate) {
                    return res.status(http_status_codes.StatusCodes.OK).json({
                        message: "Request to update is save and waiting for approval"
                    });
                }
            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePassenger",
                error: error
            })
        }
    },

    async deletePassenger(req, res, next) {
        try {
            passengerId = req.params.passengerId;
            const passenger = await Passenger.destroy({
                where: {
                    id: passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Passenger Deleted Successfully'
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Passenger"
            });
        }
    },

    async getbyId(req, res, next) {
        try {
            const passenger = await Passenger.findOne({
                where: {
                    id: req.params.passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(passenger);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single passenger"
            })
        }
    },

    async activatePassenger(req, res, next) {
        try {
            passengerId = req.params.passengerId;

            Passenger.update({
                isActive: true
            }, {
                where: {
                    id: passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Activated Sussessfully"
            });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in activatePassenger"
            })
        }
    },

    async blockPassenger(req, res, next) {
        try {
            passengerId = req.params.passengerId;

            Passenger.update({
                isActive: false
            }, {
                where: {
                    id: passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Blocked Sussessfully"
            });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in blockPassenger"
            })
        }
    },

    async searchPassenger(req, res, next) {
        try {
            const passenger = await Passenger.findAll({
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
                attributes: ['firstName', 'lastName', 'phoneNumber', 'image', 'id']
            })
            return res.status(http_status_codes.StatusCodes.OK).json(passenger);
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in search passenger",
                err: error
            })
        }
    },
};