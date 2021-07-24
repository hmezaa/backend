const http_status_codes = require('http-status-codes');
const sequelize = require("sequelize");
const op = sequelize.Op;

const {
    Booking,
    Driver,
    DriverToUpdate,
    VehicleType,
    Passenger,
    PassengerToUpdate,
    ReservedBooking,
    Queue,

} = require('../../database/database');
const {
    Template
} = require('ejs');

module.exports = {


    async getAllDashboardStas(req, res, next) {
        try {
            const passengers = await Passenger.findAll();
            const passengersToUpDate = await PassengerToUpdate.findAll();
            const driversToUpdate = await DriverToUpdate.findAll();
            const drivers = await Driver.findAll();
            const vehicletypes = await VehicleType.findAll();
            const bookings = await Booking.findAll();
            const completedBookings = await Booking.findAll({ where: { status: 'completed' } });
            const cancelledBookings = await Booking.findAll({ where: { status: 'cancelled' } });
            const apprivedDrivers = await Driver.findAll({ where: { isApproved: true } });
            const pendingDrivers = await Driver.findAll({ where: { isApproved: false } });
            const anonymousPassenger = await Passenger.findAll({ where: { isAnonymous: true } });
            const namedPassenger = await Passenger.findAll({ where: { isAnonymous: false } });
            const activePassenger = await Passenger.findAll({ where: { isActive: true } });
            const inactivePassenger = await Passenger.findAll({ where: { isActive: false } });
            const reservedBookings = await ReservedBooking.findAll();
            const availableDrivers = await Queue.findAll();
            cancelledVsCompleted = [
                {
                    name: 'Completed Rides',
                    value: completedBookings.length
                },
                {
                    name: 'Cancelled Rides',
                    value: cancelledBookings.length
                },
                {
                    name: 'Scheduled Rides',
                    value: reservedBookings.length
                }
            ];
            approvedVsPending = [
                {
                    name: 'Approved',
                    value: apprivedDrivers.length
                },
                {
                    name: 'Pending',
                    value: pendingDrivers.length
                },
                {
                    name: 'Available',
                    value: availableDrivers.length
                }
            ];
            anonymousVsNamed = [
                {
                    name: 'Anonymous',
                    value: anonymousPassenger.length
                },
                {
                    name: 'Named',
                    value: namedPassenger.length
                },
                {
                    name: 'Active',
                    value: activePassenger.length
                },
                {
                    name: 'Inactive',
                    value: inactivePassenger.length
                }
            ];

            return res.json({
                noOfPassengers: passengers.length,
                noOfDrivers: drivers.length,
                noOfVehicletypes: vehicletypes.length,
                noOfBookings: bookings.length,
                noOfCompletedBookings: completedBookings.length,
                noOfCcancelledBookings: cancelledBookings.length,
                noOfReservedBookings: reservedBookings.length,
                noOfAvailableDrivers: availableDrivers.length,
                cancelledVsCompletedPieData: cancelledVsCompleted,
                approvedVsPendingPieData: approvedVsPending,
                anonymousVsNamedPieData: anonymousVsNamed,
                passengersToUpDate: passengersToUpDate.length,
                driversToUpdate: driversToUpdate.length
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllDashboardStas",
                err: err
            });
        }
    },





};