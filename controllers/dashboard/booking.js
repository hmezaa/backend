const http_status_codes = require('http-status-codes');
const sequelize = require("sequelize");
const op = sequelize.Op;

const {
    Booking,
    Driver,
    Vehicle,
    VehicleType,
    Passenger,
    ReservedBooking
} = require('../../database/database');
const {
    Template
} = require('ejs');

module.exports = {
    async getAllCustomerBookings(req, res, next) {
        try {
            const bookings = await Booking.findAll({
                where: {
                    passengerId: req.params.passengerId
                },
                attributes: ['id', 'pickup', 'destination', 'pickDateTime', 'endTripTime', 'status', 'bookingUniqueId'],
                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },

                ],
                order: [['createdAt', 'DESC']],
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllCustomerBookings"
            });
        }
    },

    async getAllDriverBookings(req, res, next) {
        try {
            const driverId = req.params.driverId;
            const bookings = await Booking.findAll({
                where: { driverId: driverId },
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'pickup', 'destination', 'pickDateTime', 'endTripTime', 'status', 'bookingUniqueId'],
                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },

                ]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllCustomerBookings"
            });
        }
    },

    async getAllBookings(req, res, next) {
        try {
            const bookings = await Booking.findAll({
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'pickup', 'destination', 'pickDateTime', 'endTripTime', 'status', 'bookingUniqueId'],
                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },
                    {
                        model: Passenger,
                        attributes: ['firstName']
                    },
                ]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(bookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllBookings"
            });
        }
    },

    async getAllScheduledBookings(req, res, next) {
        try {
            const scheduledBookings = await ReservedBooking.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },
                ]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(scheduledBookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllScheduledBookings"
            });
        }
    },

    async getScheduledBookingById(req, res, next) {
        try {
            const bookingId = req.params.bookingId;
            const scheduledBooking = await ReservedBooking.findOne({
                where: { id: bookingId },
                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },
                ]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(scheduledBooking);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getScheduledBookingById",
                err: err
            });
        }
    },

    async getAllCancelledBookings(req, res, next) {
        try {
            const canceledBookings = await Booking.findAll({
                order: [['createdAt', 'DESC']],
                where: { status: 'cancelled' },
                attributes: ['id', 'pickup', 'destination', 'pickDateTime', 'endTripTime', 'status', 'bookingUniqueId'],
                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },
                    {
                        model: Passenger,
                        attributes: ['firstName']
                    },
                ]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(canceledBookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllCanceledBookings"
            });
        }
    },

    async getAllCompletedBookings(req, res, next) {
        try {
            const completedBookings = await Booking.findAll({
                order: [['createdAt', 'DESC']],
                where: { status: 'completed' },
                attributes: ['id', 'pickup', 'destination', 'pickDateTime', 'endTripTime', 'status', 'bookingUniqueId'],
                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },
                    {
                        model: Passenger,
                        attributes: ['firstName']
                    },
                ]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(completedBookings);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllCompletedBookings"
            });
        }
    },

    async getById(req, res, next) {
        try {
            const bookingId = req.params.bookingId;
            const booking = await Booking.findOne({
                where: { id: bookingId },

                include: [
                    {
                        model: Driver,
                        attributes: ['firstName'],
                        include: [
                            {
                                model: Vehicle,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: VehicleType,
                                        attributes: ['vehicleName']
                                    }
                                ]
                            }
                        ]

                    },
                    {
                        model: Passenger,
                        attributes: ['firstName']
                    },
                ]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(booking);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getById"
            });
        }
    },



};