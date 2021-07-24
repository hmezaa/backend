const http_status_codes = require('http-status-codes');

const {
    FeedBack,
    Driver,
    Passenger,
    Booking
} = require('../../database/database');


module.exports = {

    async getAllFeedBack(req, res, next) {
        try {
            const feedbacks = await FeedBack.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    { model: Driver, attributes: ['firstName'] },
                    { model: Passenger, attributes: ['firstName'] },
                    { model: Booking, attributes: ['bookingUniqueId'] },

                ]
            });            
            return res.status(http_status_codes.StatusCodes.OK).json(feedbacks);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getAllFeedBack",
                err: err
            });
        }
    },

};