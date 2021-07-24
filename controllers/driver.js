//controlers
const http_status_codes = require('http-status-codes');
const hashedpassword = require("password-hash");
const sequelize = require("sequelize");
const op = sequelize.Op;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var randomstring = require("randomstring");

const {
    Driver,
    FeedBack,
    DriverToUpdate,
    Booking,
    Founds
} = require('../database/database');
const driver = require('../models/driver');
module.exports = {

    // fara nwow
    async signUpWithPhoneNumber(req, res, next) {

        try {
            const {
                firstName,
                lastName,
                phoneNumber,
                city,
                currentLat,
                currentLng,
                address,
                postalCode
            } = req.body;


            Driver.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            }).then(isDriverExist => {
                if (isDriverExist) {
                    res.json({
                        error: "This Driver already exists with this phone number",
                        driver: isDriverExist
                    });
                } else {
                    Driver.create({
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        city: city,
                        currentLat: currentLat,
                        currentLng: currentLng,
                        address: address,
                        postalCode: postalCode
                    })
                        .then((driver) => {

                            return res.status(http_status_codes.StatusCodes.CREATED).json({
                                message: 'Driver is Created Successfully',
                                driver: driver
                            });
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

    async signInWithPhoneNumber(req, res, next) {
        try {
            const {
                phoneNumber
            } = req.body;
            const driver = await Driver.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            });
            if (driver) {

                res.json({
                    message: "successfully login",
                    driver: driver,
                });
            } else {
                return res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                    message: "UNAUTHORIZED"
                });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                errorMessage: "Error Occurd in signInWithPhoneNumber",
                errorDetails: err
            });
        }
    },


    // before fara
    async createDriver(req, res, next) {

        try {
            const {
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                driverPhoto,
                gender,
                address,
                postalCode,
                city,
                currentLat,
                currentLng
            } = req.body;

            Driver.findOne({
                where: {
                    email: email
                }
            }).then(isDriverExist => {
                if (isDriverExist) {
                    res.json({
                        error: "This Driver already exists"
                    });
                } else {

                    Driver.create({
                        firstName: firstName,
                        lastName: lastName,
                        password: hashedpassword.generate(password),
                        email: email,
                        phoneNumber: phoneNumber,
                        driverPhoto: driverPhoto,
                        address: address,
                        postalCode: postalCode,
                        city: city,
                        gender: gender,
                        nie_Dnle: null,
                        nie_Dnle_FrontPic: null,
                        nie_Dnle_BackPic: null,
                        nationality: null,
                        accountNumber: null,
                        isApproved: false,
                        currentLat: currentLat,
                        currentLng: currentLng
                    })
                        .then((driver) => {
                            return res.status(http_status_codes.StatusCodes.CREATED).json({
                                message: 'Driver is Created Successfully',
                                driverId: driver.id,
                                driverObj: driver
                            });
                        });
                }
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error Occurd in Creating Driver"
            });
        }
    },

    signinDriver(req, res, next) {

        try {
            const {
                email,
                password,
            } = req.body;

            Driver.findOne({
                where: {
                    email: req.body.email
                },
            }).then(isDriverExist => {
                if (isDriverExist) {
                    const verify_password = hashedpassword.verify(
                        req.body.password, isDriverExist.password
                    );

                    if (verify_password) {
                        if (isDriverExist.isApproved == true) {
                            const token = jwt.sign({
                                email: req.body.email,
                                driverId: isDriverExist.id
                            },
                                "very-long-string-for-secret", {
                                expiresIn: 3600
                            }
                            );
                            const deviceId = randomstring.generate({
                                charset: 'alphanumeric'
                            });

                            Driver.update({
                                logedInDeviceId: deviceId
                            }, {
                                where: {
                                    id: isDriverExist.id
                                }
                            });

                            res.json({
                                message: "successfully login",
                                accessToken: token,
                                driver: isDriverExist,
                                newDeviceId: deviceId,
                                oldDeviceId: isDriverExist.logedInDeviceId,
                                expiresIn: '3600'
                            })

                        } else if (isDriverExist.isApproved == false) {
                            res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                                error: 'Sorry, you are not approved by Admin yet.'
                            });
                        }
                    } else {
                        res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                            error: 'invalidcredentials'
                        })
                    }

                } else {
                    res.status(http_status_codes.StatusCodes.UNAUTHORIZED).json({
                        error: 'driver does not exist'
                    })
                }
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'error in signinDriver'
            });
        }
    },

    async resetPassword(req, res, next) {
        try {
            const driverId = req.params.id;
            const oldpassword = req.body.oldpassword;
            const newpassword = req.body.newpassword;
            Driver.findOne({
                where: {
                    id: driverId
                }
            })
                .then((isDriver) => {
                    const isAuth = hashedpassword.verify(
                        oldpassword,
                        isDriver.password
                    );
                    if (isAuth) {

                        isDriver.update({
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


    async findDriverByEmail(req, res, next) {
        try {
            const {
                email
            } = req.body;

            const driver = await Driver.findOne({
                where: {
                    email: email
                }
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driver: driver,
                    isDriverExist: true
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driver: null,
                    isDriverExist: false
                });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in finding findDriverByEmail"
            });
        }
    },

    async findDriverByPhoneNumber(req, res, next) {
        try {
            const {
                phoneNumber
            } = req.body;

            const driver = await Driver.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driver: driver,
                    isDriverExist: true
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driver: null,
                    isDriverExist: false
                });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in finding findDriverByphoneNumber"
            });
        }
    },

    async getallAvailableDrivers(req, res, next) {
        try {

            const driver = await Driver.findAll({
                where: {
                    [op.and]: [{
                        diverAvailablity: true
                    },
                    {
                        isApproved: true
                    }
                    ]
                },
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'currentLat',
                    'currentLng',
                    'email',
                ],
                order: [['createdAt', 'DESC']],
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driver: driver,
                    isDriverExist: true
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driver: null,
                    isDriverExist: false
                });
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in finding find Available Drivers"
            });
        }
    },


    async isDriverLogin(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                isDriverLogin: driver.isLogedIn
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
            })
        }
    },

    async deleteDriver(req, res, next) {
        try {
            driverId = req.params.driverId;
            const driver = await Driver.destroy({
                where: {
                    id: driverId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Driver Deleted Successfully'
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting Driver"
            });
        }
    },


    async approveDriver(req, res, next) {
        try {
            driverId = req.params.driverId;

            Driver.update({
                isApproved: true
            }, {
                where: {
                    id: driverId
                }
            })
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Approved sussessfully",
                approvalStatus: true
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in approveDriver"
            })
        }
    },

    async disApproveDriver(req, res, next) {
        try {
            driverId = req.params.driverId;

            Driver.update({
                isApproved: false
            }, {
                where: {
                    id: driverId
                }
            })
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Disapproved sussessfully",
                approvalStatus: false
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in disApproveDriver"
            })
        }
    },

    async updateDriver(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const {
                firstName,
                lastName,
                phoneNumber
            } = req.body

            const isRequestedAlready = await DriverToUpdate.findOne({ where: { driverId: driverId } });
            if (isRequestedAlready) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "Request to update is already recorded and pending for approval"
                });
            }
            else {
                const driverToUpdate = await DriverToUpdate.create({
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    driverId: driverId
                });
                if (driverToUpdate) {
                    return res.status(http_status_codes.StatusCodes.OK).json({
                        message: "Requestto update is save and waiting for approval"
                    });
                }
            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updateDriver"
            })
        }
    },

    async approveUpdateDriver(req, res, next) {
        try {
            const drivertoupdateId = req.params.drivertoupdateId;
            const {
                firstName,
                lastName,
                phoneNumber,
                driverId
            } = req.body;

            await Driver.update({
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                isUpdateApproved: true,
                isUpdateDeclined: false
            }, {
                where: {
                    id: driverId
                }
            })
                .then(() => {
                    DriverToUpdate.destroy({
                        where: {
                            id: drivertoupdateId
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
                message: "an error occured in approveUpdateDriver",
                error: error
            })
        }
    },

    async declineUpdateDriver(req, res, next) {
        try {
            const drivertoupdateId = req.params.drivertoupdateId;
            const {
                driverId
            } = req.body;

            await Driver.update({
                isUpdateDeclined: true,
                isUpdateApproved: false
            }, {
                where: {
                    id: driverId
                }
            })
                .then(() => {
                    DriverToUpdate.destroy({
                        where: {
                            id: drivertoupdateId
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

    async updateDriverPhoneNumber(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const {
                phoneNumber
            } = req.body;

            await Driver.update({
                phoneNumber: phoneNumber
            }, {
                where: {
                    id: driverId
                }
            });

            res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updateDriverPhoneNumber"
            })
        }
    },


    async updateDriverPhoto(req, res, next) {
        try {
            const driverId = req.params.driverId;

            const {
                driverPhoto
            } = req.body;

            await Driver.update({
                driverPhoto: driverPhoto
            }, {
                where: {
                    id: driverId
                }
            });

            res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updateDriverPhoneNumber"
            })
        }
    },


    async updateDriverCity(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const {
                cityName
            } = req.body;

            await Driver.update({
                city: cityName
            }, {
                where: {
                    id: driverId
                }
            });

            res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in updateDriverCity"
            })
        }
    },

    async falseStatusOfApproveAndDecline(req, res, next) {
        try {
            const driverId = req.params.driverId;


            await Driver.update({
                isUpdateDeclined: false,
                isUpdateApproved: false
            }, {
                where: {
                    id: driverId
                }
            });

            res.status(http_status_codes.StatusCodes.OK).json({
                message: "falsed sussessfully"
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in falseStatusOfApproveAndDecline"
            })
        }
    },


    async logoutDriver(req, res, next) {
        try {
            driverId = req.params.driverId;

            Driver.update({
                isLogedIn: false
            }, {
                where: {
                    id: driverId
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

    async isLogedInTrue(req, res, next) {
        try {
            driverId = req.params.driverId;

            Driver.update({
                isLogedIn: true
            }, {
                where: {
                    id: driverId
                }
            }).then(a => {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: "is Logged In sussessfully"
                })
            })

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in isLogedInTrue Driver"
            })
        }
    },

    async changeDriverAvailabiliyStatus(req, res, next) {
        try {
            driverId = req.params.driverId;
            const {
                isAvailable
            } = req.body
            Driver.update({
                diverAvailablity: isAvailable
            }, {
                where: {
                    id: driverId
                }
            })
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in changeDriverAvailabiliyStatus"
            })
        }
    },

    async createDriverBankDetails(req, res, next) {
        try {
            driverId = req.params.driverId;
            const {
                nie_Dnle,
                nie_Dnle_FrontPic,
                nie_Dnle_BackPic,
                nationality,
                accountNumber

            } = req.body
            Driver.update({

                nie_Dnle: nie_Dnle,
                nie_Dnle_FrontPic: nie_Dnle_FrontPic,
                nie_Dnle_BackPic: nie_Dnle_BackPic,
                nationality: nationality,
                accountNumber: accountNumber
            }, {
                where: {
                    id: driverId
                }
            })
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in createDriverBankDetails"
            })
        }
    },

    async updateCurrentLocation(req, res, next) {
        try {
            driverId = req.params.driverId;
            const {
                currentLat,
                currentLng,
                address,
                postalCode,

            } = req.body
            Driver.update({
                currentLat: currentLat,
                currentLng: currentLng,
                address: address,
                postalCode: postalCode,
            }, {
                where: {
                    id: driverId
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

    async getAvailabilityStatus(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                }
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    isDriverAvailable: driver.diverAvailablity
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'Driver Not Found'
                });
            }
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single getAvailabilityStatus"
            })
        }
    },
    async updateAvailableFounds( req, res, next ){ // Add by HMA AvailableFounds
        try {
            driverId = req.params.driverId;
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                }
            });
            Driver.update({
                available: driver.available + parseInt(req.query.amount)
            }, {
                where: {
                    id: driverId
                }
            });
            today = new Date();
            await Founds.create({
                idDriver: driverId,
                amount: parseInt(req.query.amount),
                Method: req.query.method,
                idPayment: req.query.idpayment,
                isConfirmed: req.query.isconfirmed,
                date: today
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Updated sussessfully"
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in AddFoundsToDriver"
            })
        }
    },    // End of Add by HMA AvailableFounds
    async getAvailableFounds( req, res, next ){
        try {        
            driverId = req.params.driverId;
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                }
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    Amount: driver.available
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'Driver Not Found'
                });
            }
        } catch  (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single getAvailabilityStatus"
            })
        }
    }, // End of Add by HMA AvailableFounds
    async getApprovalStatus(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                }
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    isDriverApproved: driver.isApproved
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'Driver Not Found'
                });
            }
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single getAvailabilityStatus"
            })
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
                message: "Error occured in fetching single driver"
            })
        }
    },

    async getStatusOfApproveOrDecline(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['isUpdateDeclined', 'isUpdateApproved']
            });

            return res.status(http_status_codes.StatusCodes.OK).json({
                isUpdateDeclinedStatus: driver.isUpdateDeclined,
                isUpdateApprovedStatus: driver.isUpdateApproved
            });

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
            })
        }
    },

    async getByPhone(req, res, next) {
        try {
            const { phoneNumber } = req.body;
            const driver = await Driver.findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({ isExist: true, message: 'Driver exists with this phone number' });
            } else {

            } return res.status(http_status_codes.StatusCodes.OK).json({ isExist: false, message: 'Driver does not exist with this phone number' });


        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching getByPhone"
            })
        }
    },

    async getPhotoById(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'driverPhoto']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
            })
        }
    },
    async getBalanceById(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'balance', 'viacard', 'viacash']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
            })
        }
    },

    async getEarningsViaCash(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'earningsviacash']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching getEarningsViaCash"
            })
        }
    },
    async getEarningsViaCard(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'earningsviacard']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching getEarningsViaCard"
            })
        }
    },

    async getRatingById(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'rating']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
            })
        }
    },

    async getRatingBalanceById(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'rating', 'balance']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
            })
        }
    },

    async getIsRequestedStatusById(req, res, next) {
        try {
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'isWithdrawRequested']
            });
            return res.status(http_status_codes.StatusCodes.OK).json(driver);

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single driver"
            })
        }
    },

    async getAll(req, res, next) {
        try {
            const drivers = await Driver.findAll({
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(drivers);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All drivers"
            });
        }
    },

    async rateDriver(req, res, next) {

        try {
            const {
                driverId,
                passengerId,
                feedback,
                rating,
                payVia,
                bookingId
            } = req.body;

            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'rating', 'rating_no']
            });
            Booking.update({
                paymentVia: payVia
            }, {
                where: {
                    id: bookingId
                }
            })
            if (driver.rating_no === 0) {
                Driver.update({
                    rating: rating,
                    rating_no: 1
                }, {
                    where: {
                        id: driverId
                    }
                })
                    .then(() => {
                        FeedBack.create({
                            driverId: driverId,
                            passengerId: passengerId,
                            feedback: feedback,
                            rating: rating,
                            bookingId: bookingId
                        })
                            .then(() => {
                                return res.status(http_status_codes.StatusCodes.OK).json({
                                    message: "Rated Successfully"
                                });
                            });
                    });
            } else if (driver.rating_no === 1) {

                Driver.update({
                    rating_no: (driver.rating_no + 1),
                    rating: (driver.rating + rating) / 2
                }, {
                    where: {
                        id: driverId
                    }
                })
                    .then(() => {
                        FeedBack.create({
                            driverId: driverId,
                            passengerId: passengerId,
                            feedback: feedback,
                            rating: rating,
                            bookingId: bookingId
                        })
                            .then(() => {
                                return res.status(http_status_codes.StatusCodes.OK).json({
                                    message: "Rated Successfully"
                                });
                            });
                    });

            } else if (driver.rating_no > 1) {

                Driver.update({
                    rating_no: driver.rating_no + 1,
                    rating: ((driver.rating * driver.rating_no) + rating) / (driver.rating_no + 1)
                }, {
                    where: {
                        id: driverId
                    }
                })
                    .then(() => {
                        FeedBack.create({
                            driverId: driverId,
                            passengerId: passengerId,
                            feedback: feedback,
                            rating: rating,
                            bookingId: bookingId
                        })
                            .then(() => {
                                return res.status(http_status_codes.StatusCodes.OK).json({
                                    message: "Rated Successfully"
                                });
                            });
                    });
            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured",
                error: error
            })
        }
    },

    async updatePassword(req, res, next) {
        try {
            id = req.params.id;
            const {
                password
            } = req.body

            Driver.update({
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

    async forgotPassword(req, res, next) {
        const reqData = req.body;
        Driver.findOne({
            where: {
                email: reqData.email
            }
        }).then(isDriver => {
            if (isDriver) {
                // send email
                var drivermail = req.body.email;
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
                    to: drivermail, // list of receivers
                    subject: 'Driver Password Verification Code', // Subject line
                    text: 'Here is a code to setup your password again', // plain text body
                    html: 'Hi Dear Driver <br>Please verify your email using the link below and get back your password! <b style="font-size:24px;margin-left:30px"> Your code - ' + rand + '<b>' // html body

                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.json('error occured')
                    } else {
                        res.json({
                            driver: isDriver,
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

    async idDeviceIdMatched(req, res, next) {
        try {
            const {
                logedInDeviceId
            } = req.body;
            const driver = await Driver.findOne({
                where: {
                    id: req.params.driverId
                },
                attributes: ['id', 'logedInDeviceId']
            });
            if (driver) {
                if (driver.logedInDeviceId === logedInDeviceId) {
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

    async findDriverByCity(req, res, next) {
        try {
            const {
                city
            } = req.body;
            const driver = await Driver.findOne({
                where: {
                    [op.and]: [{
                        city: city
                    },
                    {
                        driverAvailability: true
                    }
                    ]
                }
            });
            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driverId: driver.id
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json('Driver Not Found');
            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single findDriverByCity",
                error: error
            })
        }
    },

    async declineCallOrderAndFindNewDriver(req, res, next) {
        try {
            const {
                declineDriversIdArray,
                city
            } = req.body;
            const driver = await Driver.findOne({
                where: {
                    [op.and]: [{
                        city: city
                    },
                    {
                        driverAvailability: true
                    },
                    {
                        id: {
                            [op.not]: declineDriversIdArray
                        }
                    },
                    ]
                }
            });

            if (driver) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    driverId: driver.id
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json('Driver Not Found');
            }

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching single declineCallOrderAndFindNewDriver",
                error: error
            })
        }
    },

};