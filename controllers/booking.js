const http_status_codes = require('http-status-codes');
const sequelize = require("sequelize");
const op = sequelize.Op;
var cron = require('node-cron');
var randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const datetimeDifference = require("datetime-difference");
const addSubtractDate = require("add-subtract-date");
var geodist = require('geodist');
const {
    Booking,
    Driver,
    Passenger,
    Vehicle,
    Message,
    Model,
    Conversation,
    ReservedBooking,
    VehicleType
} = require('../database/database');

module.exports = {

    async createBooking(req, res, next) {
        try {
            const {
                pickup,
                destination,
                pickDateTime,
                endTripTime,
                driverId,
                passengerId,
                status,
                cancellReason,
                totalCost,
                paymentVia,
                journeyCost,
                endingSpeed,
                cancelledBy,
                voiceOrder
            } = req.body;

            const bookingUniqueId = randomstring.generate({
                charset: 'numeric',
                length: 10
            });

            const booking = await Booking.create({

                pickup: pickup,
                destination: destination,
                pickDateTime: pickDateTime,
                endTripTime: endTripTime,
                driverId: driverId,
                passengerId: passengerId,
                status: status,
                cancellReason: cancellReason,
                totalCost: totalCost,
                journeyCost: journeyCost,
                paymentVia: paymentVia,
                bookingUniqueId: bookingUniqueId,
                endingSpeed: endingSpeed,
                cancelledBy: cancelledBy,
                voiceOrder: voiceOrder
            });

            if (booking) {
                const date = Date().toLocaleUpperCase();
                const driver = await Driver.findOne({
                    where: {
                        id: driverId
                    }
                });
                const passenger = await Passenger.findOne({
                    where: {
                        id: passengerId
                    }
                });

                var maillist = [
                    driver.email,
                    passenger.email
                ];

                const isConExist = await Conversation.findOne({
                    where: {
                        [op.or]: [{
                            [op.and]: [{
                                senderId: passengerId
                            },
                            {
                                receiverId: driverId
                            }
                            ]
                        },
                        {
                            [op.and]: [{
                                senderId: driverId
                            },
                            {
                                receiverId: passengerId
                            }
                            ]
                        }
                        ]
                    }
                });

                if (isConExist) {
                    await Message.destroy({
                        where: {
                            conversationId: isConExist.id
                        }
                    });
                    await Conversation.destroy({
                        where: {
                            id: isConExist.id
                        }
                    });
                }

                if (paymentVia === 'card' && status === 'completed') {

                    const driver = await Driver.findOne({
                        where: {
                            id: driverId
                        }
                    });
                    if (driver) {
                        Driver.update({
                            earningsviacard: (journeyCost + driver.earningsviacard)
                        }, {
                            where: {
                                id: driverId
                            }
                        });
                    }
                } else if (paymentVia === 'cash' && status === 'completed') {

                    const driver = await Driver.findOne({
                        where: {
                            id: driverId
                        }
                    });
                    if (driver) {
                        Driver.update({
                            earningsviacash: (journeyCost + driver.earningsviacash)
                        }, {
                            where: {
                                id: driverId
                            }
                        });
                    }
                };

                return res.status(http_status_codes.StatusCodes.OK).json(booking);
            }

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }
    },

    async reserveBooking(req, res, next) {
        try {
            const {
                date,
                reserveCode,
                time,
                city,
                currentLat,
                currentLng,
                paymentVia,
                destination,
                estTime,
                totalKM,
                currentAddress,
                journeyCost,
                passenger,
                vehicleName,
                driverId,
                passengerId,
                vehicleTypeId,
                isFromAdmin
            } = req.body;



            const isReserved = await ReservedBooking.findOne({
                where: {
                    reserveCode: reserveCode
                }
            });
            if (isReserved) {
                res.json({
                    message: 'This booking is already reserved'
                });
            } else {
                const reservebooking = await ReservedBooking.create({
                    date: date,
                    reserveCode: reserveCode,
                    time: time,
                    city: city,
                    currentLat: currentLat,
                    currentLng: currentLng,
                    paymentVia: paymentVia,
                    destination: destination,
                    estTime: estTime,
                    totalKM: totalKM,
                    journeyCost: journeyCost,
                    currentAddress: currentAddress,
                    passenger: passenger,
                    vehicleName: vehicleName,
                    driverId: driverId,
                    passengerId: passengerId,
                    vehicleTypeId: vehicleTypeId,
                    isFromAdmin: isFromAdmin
                });

                if (reservebooking) {
                    res.json({
                        message: 'Reserved Successfully'
                    });
                }
            }

        } catch (err) {

            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in reservebooking",
                err: err
            });
        }
    },

    async changeStatus(req, res, next) {
        try {
            reservedId = req.params.reservedId;
            ReservedBooking.update({
                isStarted: true,
            }, {
                where: {
                    id: reservedId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: "Status Changed Sussessfully",
                action: 'Please emit a socket with passengerId'
            })

        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "an error occured in changeStatus"
            })
        }
    },

    async getAllDriverBookings(req, res, next) {
        try {
            const offset = parseInt(req.params.offset);
            const bookings = await Booking.findAll({
                where: {
                    driverId: req.params.driverId
                },
                include: [{
                    model: Passenger,
                    attributes: ['firstName', 'lastName', 'phoneNumber', 'image']
                }],
                order: [['createdAt', 'DESC']],
                limit: 10,
                offset: 10 * offset
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                err: err,
                message: "Error Occurd in Fetching getAllDriverBookings"
            });
        }
    },




    async getAllDriverReserveBookings(req, res, next) {
        try {
            const bookings = await ReservedBooking.findAll({
                where: {
                    driverId: req.params.driverId
                },
                order: [['createdAt', 'DESC']],

            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllDriverReserveBookings"
            });
        }
    },

    async getAllCustomerReserveBookings(req, res, next) {
        try {
            const bookings = await ReservedBooking.findAll({
                where: {
                    passengerId: req.params.passengerId
                },
                order: [['createdAt', 'DESC']],
                include: [{
                    model: Driver,
                    attributes: ['firstName', 'lastName', 'phoneNumber', 'driverPhoto']
                }]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllCustomerReserveBookings"
            });
        }
    },

    async getallBookingsOfCustomer(req, res) {
        try {
            const offset = parseInt(req.params.offset);
            const bookings = await Booking.findAll({
                where: {
                    passengerId: req.params.passengerId
                },
                include: [{
                    model: Driver,
                    attributes: ['firstName', 'lastName', 'phoneNumber', 'driverPhoto']
                }],
                order: [['createdAt', 'DESC']],
                limit: 10,
                offset: 10 * offset
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getallBookingsOfCustomer",
                err: err
            });
        }
    },

    async getallCustomerBookings(req, res) {
        try {
            const offset = parseInt(req.params.offset);
            const bookings = await Booking.findAll({
                where: {
                    passengerId: req.params.passengerId
                },
                include: [{
                    model: Driver,
                    attributes: ['firstName', 'lastName', 'phoneNumber', 'driverPhoto']
                }],
                order: [['createdAt', 'DESC']],
                limit: 10,
                offset: 10 * offset
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllDriverBookings",
                err: err
            });
        }
    },

    async getallBookingsOfDriver(req, res) {
        try {
            const bookings = await Booking.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    driverId: req.params.driverId
                },
                include: [{
                    model: Passenger,
                    attributes: ['firstName', 'lastName', 'phoneNumber']
                }]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getallBookingsOfDriver",
                err: err
            });
        }
    },

    async getAllBookings(req, res, next) {
        try {
            const bookings = await Booking.findAll({
                order: [['createdAt', 'DESC']],
                include: [{
                    model: Passenger
                }, {
                    model: Driver
                }]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllBookings"
            });
        }
    },

    async getAllReservedBookingsByPassenger(req, res, next) {
        try {
            const passengerId = req.params.passengerId;
            const rBookings = await ReservedBooking.findAll({
                where: {
                    passengerId: passengerId
                },
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                noOfReservedBookings: rBookings.length
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllReservedBookingsByPassenger"
            });
        }
    },

    async getAllReservedBookingsDriver(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const rBookings = await ReservedBooking.findAll({
                where: { driverId: driverId },
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                noOfReservedBookings: rBookings.length
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllReservedBookingsByPassenger"
            });
        }
    },


    async getStartedReservedBookingByDriver(req, res, next) {
        try {
            const {
                date
            } = req.body;

            driverId = req.params.driverId;

            const booking = await ReservedBooking.findOne({
                where: {
                    [op.and]: [{
                        isStarted: true
                    },
                    {
                        driverId: driverId
                    },
                    {
                        date: date
                    }
                    ]
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(booking);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getStartedReservedBookingByDriver"
            });
        }
    },

    async getStartedReservedBookingByPassenger(req, res, next) {
        try {
            const {
                date
            } = req.body;

            passengerId = req.params.passengerId;

            const booking = await ReservedBooking.findOne({
                where: {
                    [op.and]: [{
                        isStarted: true
                    },
                    {
                        passengerId: passengerId
                    },
                    {
                        date: date
                    }
                    ]
                },
                include: {
                    model: Driver,
                    include: {
                        model: Vehicle,
                        include: [{
                            model: Model,
                        }, {
                            model: VehicleType,
                        }
                        ]
                    }
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json(booking);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getStartedReservedBookingByPassenger"
            });
        }
    },

    async calculateEstimatedPrice(req, res, next) {
        try {
            const {
                km,
                isMorning,
                isWeekend,
                isAirport,
                seatingCapacity,
                isLite
            } = req.body;
            // morning time starts
            if (km < 25) {
                if (isWeekend == false && isMorning == true) {
                    if (seatingCapacity >= 5 && isLite == false) {
                        //  morning time & seating capacity >= 25
                        let perKmPrice = (1.09 * km);
                        let estimatedPrice = (perKmPrice + 2.0 + 1.5);
                        const price = Math.ceil(estimatedPrice);
                        if (isAirport == true) {

                        } else {
                            res.json({
                                totalPrice: price,
                                basePrice: 2.0
                            }); // airportkr rha tha ma tb tk
                        }


                    } else {
                        // morning time & seating capacity is other than >= 25
                        let perKmPrice = (1.09 * km);
                        let estimatedPrice = (perKmPrice + 2.0);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.0
                        });
                    }
                }
            } else if (km > 25) {
                if (isWeekend == false && isMorning == true) {
                    if (seatingCapacity >= 5 && isLite == false) {
                        //  morning time & seating capacity >= 25
                        let perKmPrice = (1.20 * km);
                        let estimatedPrice = (perKmPrice + 2.0 + 1.5);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.0
                        });

                    } else {
                        // morning time & seating capacity is other than >= 25
                        let perKmPrice = (1.20 * km);
                        let estimatedPrice = (perKmPrice + 2.0);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.0
                        });
                    }
                }
            }
            // morning time ends

            // night time starts
            if (km < 25) {
                if (isMorning == false) {
                    if (seatingCapacity >= 5 && isLite == false) {
                        //  night time & seating capacity >= 25
                        let perKmPrice = (1.19 * km);
                        let estimatedPrice = (perKmPrice + 2.5 + 2);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.5
                        });

                    } else {
                        // night time & seating capacity is other than >= 25
                        let perKmPrice = (1.19 * km);
                        let estimatedPrice = (perKmPrice + 2.5);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.5
                        });
                    }
                }
            } else if (km > 25) {
                if (isMorning == false) {
                    if (seatingCapacity >= 5 && isLite == false) {
                        //  night time & seating capacity >= 25
                        let perKmPrice = (1.40 * km);
                        let estimatedPrice = (perKmPrice + 2.5 + 2);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.5
                        });

                    } else {
                        // night time & seating capacity is other than >= 25
                        let perKmPrice = (1.40 * km);
                        let estimatedPrice = (perKmPrice + 2.5);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.5
                        });
                    }
                }
            }
            // night time ends

            // day time + weekend starts
            if (km < 25) {
                if (isWeekend == true && isMorning == true) {
                    if (seatingCapacity >= 5 && isLite == false) {
                        //  day time + weekend & seating capacity >= 25
                        let perKmPrice = (1.19 * km);
                        let estimatedPrice = (perKmPrice + 2.0 + 2.0);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.5
                        });

                    } else {
                        // day time + weekend & seating capacity is other than >= 25
                        let perKmPrice = (1.19 * km);
                        let estimatedPrice = (perKmPrice + 2.5);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.5
                        });
                    }
                }
            } else if (km > 25) {
                if (isWeekend == true && isMorning == true) {
                    if (seatingCapacity >= 5 && isLite == false) {
                        //  day time + weekend & seating capacity >= 25
                        let perKmPrice = (1.40 * km);
                        let estimatedPrice = (perKmPrice + 2.0 + 2.0);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.0
                        });

                    } else {
                        // day time + weekend & seating capacity is other than >= 25
                        let perKmPrice = (1.40 * 2.5);
                        let estimatedPrice = (perKmPrice + 2.5);
                        const price = Math.ceil(estimatedPrice);
                        res.json({
                            totalPrice: price,
                            basePrice: 2.0
                        });
                    }
                }
            }
            // day time + weekend ends

            // short distance & morning time starts
            if (km < 3 && isWeekend == false && isMorning == true) {
                res.json({
                    totalPrice: 4
                });
            }
            // short distance & morning time ends

            // short distance & morning time & weekend starts
            if (km < 3 && isWeekend == true && isMorning == true) {
                res.json({
                    totalPrice: 6
                });
            }
            // short distance & morning time & weekend ends

            // short distance & night time starts
            if (km < 3 && isMorning == true) {
                res.json({
                    totalPrice: 4
                });
            }
            // short distance & night time ends


            const bookings = await Booking.findAll();
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllBookings"
            });
        }
    },

    async deleteReserved(req, res, next) {
        try {
            reservedId = req.params.reservedId;
            const reserved = await ReservedBooking.destroy({
                where: {
                    id: reservedId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'Reserved Deleted Successfully'
            });
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting deleteReserved"
            });
        }
    },

    async getByReservedCode(req, res, next) {
        try {
            const {
                reserveCode
            } = req.body

            const reserved = await ReservedBooking.findOne({
                where: {
                    reserveCode: reserveCode
                }
            });
            if (reserved) {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'Reserved Found',
                    isReservedBooking: true
                });
            } else {
                return res.status(http_status_codes.StatusCodes.OK).json({
                    message: 'Reserved Not Found',
                    isReservedBooking: false
                });

            }
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error occured in fetching getByReservedCode"
            })
        }
    },

    async findNearByDrivers(req, res, next) {
        try {
            driversArray = [];

            const {
                vehicleTypeId,
                currentLat,
                currentLng,
                searchInKM,
            } = req.body;


            const drivers = await Driver.findAll({
                where: {
                    [op.and]: [{
                        driverAvailability: true
                    }]
                },
                include: [{
                    model: Vehicle,
                    where: {
                        vehicleTypeId: vehicleTypeId
                    },
                }]
            });
            if (drivers.length !== 0) {
                var passengerCurrentLocation = {
                    lat: currentLat,
                    lon: currentLng
                };

                await drivers.forEach(async driver => {
                    var isNearByDriverLocation = {
                        lat: driver.currentLat,
                        lon: driver.currentLng
                    };

                    var dist = geodist(passengerCurrentLocation, isNearByDriverLocation, {
                        format: true,
                        unit: 'meters'
                    });

                    var distinmeters = dist.substr(0, dist.indexOf(' '));

                    if (distinmeters < (searchInKM * 1000)) {
                        var obj = {

                            driverId: driver.id
                        }

                        driversArray.push(obj);
                    }
                });

                if (driversArray.length !== 0) {

                    return res.status(http_status_codes.StatusCodes.OK).json({
                        driversIds: driversArray
                    });

                } else {
                    return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                        errors: 'Oooops! No Near By Driver is Found!'
                    });
                }
            } else {
                return res.status(http_status_codes.StatusCodes.NOT_FOUND).json({
                    errors: 'No Driver Registered yet!'
                });
            }

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching findNearByDrivers",
                err: err
            });
        }
    },
};