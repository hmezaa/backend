const http_status_codes = require('http-status-codes');
const hashedpassword = require("password-hash");
const sequelize = require("sequelize");
const op = sequelize.Op;
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
var randomstring = require("randomstring");
const {
    Passenger,
    PassengerPreference,
    SavedLocation,
    PassengerToUpdate
} = require('../database/database');
module.exports = {
    // fara now
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

    async signUpWithOutData(req, res, next) {

        try {
            const {
                city,
                address,
                postalCode,
                currentLat,
                currentLng
            } = req.body;
            const anonymousId = randomstring.generate({
                charset: 'alphanumeric'
            });
            const anonymousName = randomstring.generate({
                charset: 'numeric',
                length: 5
            });

            const passenger = await Passenger.create({
                anonymousId: anonymousId,
                isAnonymous: true,
                firstName: 'Fara-User#',
                lastName: anonymousName,
                address: address,
                city: city,
                postalCode: postalCode,
                currentLat: currentLat,
                currentLng: currentLng
            });
            if (passenger) {
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
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in signUpWithOutData",
                errorDetails: err
            });
        }
    },

    async signInWithPhoneNumber(req, res, next) {
        try {
            const {
                phoneNumber
            } = req.body;
            const passenger = await Passenger.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            });
            if (passenger) {

                res.json({
                    message: "successfully login",
                    pessenger: passenger,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                    message: "UNAUTHORIZED"
                });
            }
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'error in signInWithPhoneNumber'
            });
        }
    },

    async signInWithOutData(req, res, next) {

        try {
            const anonymousId = req.params.anonymousId;
            const passenger = await Passenger.findOne({
                where: {
                    anonymousId: anonymousId
                }
            });
            if (passenger) {
                res.status(http_status_codes.StatusCodes.OK).json({
                    isAnonymousExist: true,
                    anonymousObj: passenger
                });
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    message: "Passenger does not exist with this anonymousId",
                    isAnonymousExist: false
                });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in signInWithOutData",
                errorDetails: err
            });
        }
    },

    async updatePassengerPhoneNumber(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const {
                phoneNumber
            } = req.body
            await Passenger.update({
                phoneNumber: phoneNumber,
                isAnonymous: false
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    Passenger.findByPk(passengerId).then(resp => {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Updated sussessfully",
                            passengerObj: resp
                        })
                    })
                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePassengerPhoneNumber"
            })
        }
    },

    async socialVerifier(req, res, next) {

        try {
            const {
                firstName,
                lastName,
                email,
                city,
                address,
                postalCode,
                currentLat,
                currentLng,
                image
            } = req.body;
            Passenger.findOne({
                where: {
                    email: email
                }
            }).then(isPassengerExist => {
                if (isPassengerExist) {
                    res.json({
                        passenger: isPassengerExist
                    });
                } else {
                    Passenger.create({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        address: address,
                        city: city,
                        postalCode: postalCode,
                        currentLat: currentLat,
                        currentLng: currentLng,
                        isAnonymous: true,
                        image: image
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
                errorMessage: "Error Occurd in socialVerifier",
                errorDetails: err
            });
        }
    },

    async updatePassengerPhoneNumberAndCity(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const {
                phoneNumber,
                city
            } = req.body
            await Passenger.update({
                phoneNumber: phoneNumber,
                isAnonymous: false,
                city: city
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    Passenger.findByPk(passengerId).then(resp => {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Updated sussessfully",
                            passengerObj: resp
                        })
                    })
                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePassengerPhoneNumberAndCity",
                error: error
            })
        }
    },

    async updateFirstLastPhoneImage(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const {
                firstName,
                lastName,
                phoneNumber,
                image
            } = req.body

            await Passenger.update({
                firstName: firstName,
                isAnonymous: false,
                lastName: lastName,
                phoneNumber: phoneNumber,
                image: image
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    Passenger.findByPk(passengerId).then(resp => {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Updated sussessfully",
                            passengerObj: resp
                        })
                    })
                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePassengerPhoneNumberAndCity",
                error: error
            })
        }
    },

    async updatePassengerFirstLastName(req, res, next) {
        try {
            passengerId = req.params.passengerId;
            const {
                firstName,
                lastName,
                phoneNumber
            } = req.body
            Passenger.update({

                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    Passenger.findByPk(passengerId).then(resp => {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Updated sussessfully",
                            passengerObj: resp
                        })
                    })
                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePassengerFirstLastName"
            })
        }
    },

    async updatePassengerImage(req, res, next) {
        try {
            passengerId = req.params.passengerId;
            const {
                image
            } = req.body
            Passenger.update({
                image: image
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    Passenger.findByPk(passengerId).then(resp => {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Updated sussessfully",
                            passengerObj: resp
                        })
                    })
                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePassengerImage"
            })
        }
    },




    // before fara

    async createPassenger(req, res, next) {

        try {
            const {

                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                gender,
                profilePhoto,
                address,
                postalCode,
                city,
                currentLat,
                currentLng
            } = req.body;


            Passenger.findOne({
                where: {
                    email: email
                }
            }).then(isPassengerExist => {
                if (isPassengerExist) {
                    res.json({
                        error: "This Passenger already exists"
                    });
                } else {

                    Passenger.create({
                        firstName: firstName,
                        lastName: lastName,
                        password: hashedpassword.generate(password),
                        email: email,
                        phoneNumber: phoneNumber,
                        gender: gender,
                        profilePhoto: profilePhoto,
                        address: address,
                        postalCode: postalCode,
                        city: city,
                        currentLat: currentLat,
                        currentLng: currentLng
                    })
                        .then((passenger) => {

                            PassengerPreference.create({
                                call: 'Do not call under any circumstances',
                                airCondition: 'Off',
                                openDoor: 'No',
                                conversation: 'I prefer silence',
                                passengerId: passenger.id
                            })
                                .then(() => {
                                    const deviceId = randomstring.generate({
                                        charset: 'alphanumeric'
                                    });
                                    Passenger.update({
                                        logedInDeviceId: deviceId
                                    }, {
                                        where: {
                                            id: passenger.id
                                        }
                                    });
                                    return res.status(http_status_codes.StatusCodes.CREATED).json({
                                        message: 'Passenger is Created Successfully',
                                        passenger: passenger
                                    });
                                });
                        });
                }
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error Occurd in Creating createPassenger"
            });
        }
    },

    signinPassenger(req, res, next) {

        try {
            const {
                email,
                password,
            } = req.body;

            Passenger.findOne({
                where: {
                    email: email
                },
            }).then(isPassengerExist => {
                if (isPassengerExist) {
                    const verify_password = hashedpassword.verify(
                        password, isPassengerExist.password
                    );
                    if (verify_password) {
                        const token = jwt.sign({
                            email: email,
                            pessengerId: isPassengerExist.id
                        },
                            "very-long-string-for-secret", {
                            expiresIn: 3600
                        }
                        );
                        const deviceId = randomstring.generate({
                            charset: 'alphanumeric'
                        });
                        Passenger.update({
                            logedInDeviceId: deviceId
                        }, {
                            where: {
                                id: isPassengerExist.id
                            }
                        });

                        res.json({
                            message: "successfully login",
                            accessToken: token,
                            pessenger: isPassengerExist,
                            newDeviceId: deviceId,
                            oldDeviceId: isPassengerExist.logedInDeviceId,
                            expiresIn: '3600'
                        })
                    } else {
                        res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                            error: 'invalidcredentials'
                        })
                    }
                } else {
                    res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                        error: 'invalidcredentials'
                    })
                }
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'error in signinPassenger'
            });
        }
    },

    async resetPassword(req, res, next) {
        try {
            const passengerId = req.params.id;
            const oldpassword = req.body.oldpassword;
            const newpassword = req.body.newpassword;
            Passenger.findOne({
                where: {
                    id: passengerId
                }
            })
                .then((isPassenger) => {
                    const isAuth = hashedpassword.verify(
                        oldpassword,
                        isPassenger.password
                    );
                    if (isAuth) {

                        isPassenger.update({
                            password: hashedpassword.generate(newpassword)
                        })
                            .then(() => {
                                res.json({
                                    message: 'Password updated successfully'
                                });
                            })
                    } else if (!isAuth) {
                        res.json({
                            message: 'Oops Password not updated'
                        });
                    }
                })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Approved"
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

    async updatePrefferedVehicleType(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const {
                prefferedVehivleTypeId
            } = req.body

            const pref = await Passenger.update({
                prefferedVehivleTypeId: prefferedVehivleTypeId
            }, {
                where: {
                    id: passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Vehicle Prefrence Updated Successfully'
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePrefferedVehicleType",
                error: error
            })
        }
    },

    async prefferedVehicleTypeStatus(req, res, next) {
        try {
            const passenger = await Passenger.findOne({ where: { id: req.params.passengerId } });
            if (passenger.prefferedVehivleTypeId == 0) {
                return res.status(http_status_codes.StatusCodes.OK).json({ isPreffered: false });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({ isPreffered: true });
            }
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single prefferedVehicleTypeStatus"
            })
        }
    },

    async approveUpdatePassenger(req, res, next) {
        try {
            const passengertoupdateId = req.params.passengertoupdateId;
            const {
                firstName,
                lastName,
                phoneNumber,
                passengerId
            } = req.body;

            await Passenger.update({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                isUpdateApproved: true,
                isUpdateDeclined: false
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    PassengerToUpdate.destroy({
                        where: {
                            id: passengertoupdateId
                        }
                    })
                        .then(() => {
                            return res.status(http_status_codes.StatusCodes.OK).json({
                                message: "Requested to update has been approved"
                            })
                        });

                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in approveUpdatePassenger",
                error: error
            })
        }
    },

    async declineUpdatePassenger(req, res, next) {
        try {
            const passengertoupdateId = req.params.passengertoupdateId;
            const {
                passengerId
            } = req.body;

            await Passenger.update({
                isUpdateDeclined: true,
                isUpdateApproved: false
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    PassengerToUpdate.destroy({
                        where: {
                            id: passengertoupdateId
                        }
                    })
                        .then(() => {
                            return res.status(http_status_codes.StatusCodes.OK).json({
                                message: "Requested to update has been declined"
                            })
                        });

                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in approveUpdateDriver",
                error: error
            })
        }
    },

    async updatePassengerCity(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const {
                city
            } = req.body
            await Passenger.update({
                city: city
            }, {
                where: {
                    id: passengerId
                }
            })
                .then(() => {
                    Passenger.findByPk(passengerId).then(resp => {
                        return res.status(http_status_codes.StatusCodes.OK).json({
                            message: "Updated sussessfully",
                            passengerObj: resp
                        })
                    })
                });
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updatePassengerCity"
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


    async logoutPassenger(req, res, next) {
        try {
            passengerId = req.params.passengerId;

            Passenger.update({
                isLogedIn: false
            }, {
                where: {
                    id: passengerId
                }
            }).then(a => {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "Logedout sussessfully"
                })
            })

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in logoutDriver"
            })
        }
    },

    async changePassengerAvailabiliyStatus(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const {
                isAvailable
            } = req.body

            await Passenger.update({
                passengerAvailability: isAvailable
            }, {
                where: {
                    id: passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in changePassengerAvailabiliyStatus"
            })
        }
    },

    async findPassengerByEmail(req, res, next) {
        try {
            const {
                email
            } = req.body;

            const passenger = await Passenger.findOne({
                where: {
                    email: email
                }
            });
            if (passenger) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    passenger: passenger,
                    isPassengerExist: true
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    passenger: null,
                    isPassengerExist: false
                });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in finding findPassengerByEmail"
            });
        }
    },

    async findPassengerByPhoneNumber(req, res, next) {
        try {
            const {
                phoneNumber
            } = req.body;

            const passenger = await Passenger.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            });
            if (passenger) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    passenger: passenger,
                    isPassengerExist: true
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    passenger: null,
                    isPassengerExist: false
                });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in finding findPassengerByphoneNumber"
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

    async getImagebyId(req, res, next) {
        try {
            const passenger = await Passenger.findOne({
                where: {
                    id: req.params.passengerId
                },
                attributes: ['id', 'image']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(passenger);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single passenger"
            })
        }
    },

    async getAvailabilityStatus(req, res, next) {
        try {
            const passenger = await Passenger.findOne({
                where: {
                    id: req.params.passengerId
                }
            });
            if (passenger) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    isPassengerAvailable: passenger.passengerAvailability
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'Passenger Not Found'
                });
            }
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single getAvailabilityStatus"
            })
        }
    },


    async isPassengerLogin(req, res, next) {
        try {
            const passenger = await Passenger.findOne({
                where: {
                    id: req.params.passengerId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                isPassengerLogin: passenger.isLogedIn
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
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


    async isLogedInTrue(req, res, next) {
        try {
            passengerId = req.params.passengerId;

            Passenger.update({
                isLogedIn: true
            }, {
                where: {
                    id: passengerId
                }
            }).then(a => {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "is LogedIn True"
                })
            })

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in isLogedInTrueDriver"
            })
        }
    },

    async getAll(req, res, next) {
        try {
            const passengers = await Passenger.findAll({
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(passengers);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All Passengers"
            });
        }
    },

    async getAllActivatedPassengers(req, res, next) {
        try {
            const actPassengers = await Passenger.findAll({
                where: {
                    isActive: true
                },
                order: [['createdAt', 'DESC']],
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
                where: {
                    isActive: false
                },
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(blkPassengers);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllBlockedPassengers"
            });
        }
    },

    async getAllSavedLocations(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const locations = await SavedLocation.findAll({
                where: {
                    passengerId: passengerId
                },
                order: [['createdAt', 'DESC']],
            });
            if (locations) {
                return res.status(http_status_codes.StatusCodes.OK).json(locations);

            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'No Location is Saved Yet!'
                });

            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All getAllSavedLocations"
            });
        }
    },

    async forgotPassword(req, res, next) {
        const reqData = req.body;
        Passenger.findOne({
            where: {
                email: reqData.email
            }
        }).then(isPassenger => {
            if (isPassenger) {
                // send email
                var passengermail = req.body.email;
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'faramobileapp@gmail.com',
                        pass: 'Shkwueyh(&*hfbf38yvs#'
                    }
                });
                var rand = Math.floor(100000 + Math.random() * 900000);

                var mailOptions = {
                    from: ' ', // sender address
                    to: passengermail, // list of receivers
                    subject: 'Passenger Password Verification Code', // Subject line
                    text: 'Here is a code to setup your password again', // plain text body
                    html: 'Hi Dear Passenger <br>Please verify your email using the link below and get back your password! <b style="font-size:24px;margin-left:30px"> Your code - ' + rand + '<b>' // html body

                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.json('error occured')
                    } else {
                        res.json({
                            passenger: isPassenger,
                            verificationCode: rand
                        });
                    }
                });

            } else {
                res.json({
                    message: "Email does not exit"
                });
            }
        }).catch(err => {
            console.log(err);
            res.json("Some Error Occured!");
        });
    },

    async updatePassword(req, res, next) {
        try {
            id = req.params.id;
            const {
                password
            } = req.body

            Passenger.update({
                password: hashedpassword.generate(password)
            }, {
                where: {
                    id: id
                }
            })
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "An error updatePassword"
            })
        }
    },

    async updateCurrentLocation(req, res, next) {
        try {
            passengerId = req.params.passengerId;
            const {
                currentLat,
                currentLng,
                city,
                address,
                postalCode,
            } = req.body
            Passenger.update({
                currentLat: currentLat,
                currentLng: currentLng,
                city: city,
                address: address,
                postalCode: postalCode,
            }, {
                where: {
                    id: passengerId
                }
            })
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updateCurrentLocation"
            })
        }
    },

    async idDeviceIdMatched(req, res, next) {
        try {
            const {
                logedInDeviceId
            } = req.body;
            const passenger = await Passenger.findOne({
                where: {
                    id: req.params.passengerId
                },
                attributes: ['id', 'logedInDeviceId']
            });
            if (passenger) {
                if (passenger.logedInDeviceId === logedInDeviceId) {
                    return res.status(http_status_codes.StatusCodes.OK).json({
                        message: 'Device Id is matched'
                    });
                } else {
                    return res.status(http_status_codes.StatusCodes.OK).json({
                        message: 'Device Id is not matched'
                    });
                }
            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching idDeviceIdMatched"
            })
        }
    },

};