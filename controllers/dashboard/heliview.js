const http_status_codes = require('http-status-codes');
const {

        Passenger,
        Driver
} = require('../../database/database');
module.exports = {

        async getAllMarkersOfHeliView(req, res, next) {
                try {
                        const markersList = {
                                guestRider: [],
                                availableRider: [],
                                unAvailableRider: [],
                                unAvailableDriver: [],
                                approvedDriver: [],
                                pendingDriver: [],
                        }
                        markersList.guestRider = await Passenger.findAll({ where: { isAnonymous: true }, attributes: ['currentLat', 'currentLng'] });
                        markersList.availableRider = await Passenger.findAll({ where: { passengerAvailability: true }, attributes: ['currentLat', 'currentLng'] });
                        markersList.unAvailableRider = await Passenger.findAll({ where: { passengerAvailability: false }, attributes: ['currentLat', 'currentLng'] });
                        markersList.unAvailableDriver = await Driver.findAll({ where: { driverAvailability: false }, attributes: ['currentLat', 'currentLng'] });
                        markersList.approvedDriver = await Driver.findAll({ where: { isApproved: true }, attributes: ['currentLat', 'currentLng'] });
                        markersList.pendingDriver = await Driver.findAll({ where: { isApproved: false }, attributes: ['currentLat', 'currentLng'] });

                        return res.status(http_status_codes.StatusCodes.OK).json(markersList);
                }
                catch (err) {
                        return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                                message: "Error Occurd in Fetching HeliView",
                                err: err
                        });
                }
        },

};