const http_status_codes = require('http-status-codes');
const {

    FavoriteDriver,
    Driver
} = require('../database/database');
module.exports = {

    async createFavoriteDriver(req, res, next) {
        try {
            const {
                driverId,
                passengerId
            } = req.body;

            await FavoriteDriver.findAll({
                where: {
                    driverId: driverId,
                    passengerId: passengerId,
                },
                order: [['createdAt', 'DESC']],
            }).then(resp => {
                if (resp.length == 0) {
                    const favoriteDriver = FavoriteDriver.create({
                        driverId: driverId,
                        passengerId: passengerId,
                    });
                    return res.status(http_status_codes.CREATED).json(favoriteDriver);
                } else {
                    res.status(http_status_codes.OK).json({
                        message: 'Driver Already Saved!'
                    })
                }
            })

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating createFavoriteDriver"
            });
        }
    },

    async updateFavoriteDriver(req, res, next) {
        try {
            const {
                driverId,
                passengerId
            } = req.body;

            favoriteDriverId = req.params.id;
            const favoriteDriver = await FavoriteDriver.update({
                driverId: driverId,
                passengerId: passengerId

            }, {
                where: {
                    id: favoriteDriverId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'FavoriteDriver Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating FavoriteDriver"
            });
        }
    },

    async getFavoriteDriver(req, res, next) {
        try {
            favoriteDriverId = req.params.id; const favoriteDriver = FavoriteDriver.findAll({ where: { passengerId: passengerId }, include: [{ model: Driver, attributes: ['firstName', 'lastName', 'email', 'phoneNumber'] }] });
            return res.status(http_status_codes.StatusCodes.OK).json(favoriteDriver);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching FavoriteDriver"
            });
        }
    },

    async getAllFavoriteDrivers(req, res, next) {
        try {
            passengerId = req.params.id;
            const favoriteDriver = await FavoriteDriver.findAll({
                order: [['createdAt', 'DESC']],
                where: { passengerId: passengerId }, include: [{ model: Driver, attributes: ['firstName', 'lastName', 'email', 'phoneNumber'] }]
            });
            return res.status(http_status_codes.StatusCodes.OK).json(favoriteDriver);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All FavoriteDriver"
            });
        }
    },




    async deleteFavoriteDriver(req, res, next) {
        try {
            favoriteDriverId = req.params.id;
            const favoriteDriver = await FavoriteDriver.destroy({ where: { id: favoriteDriverId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'FavoriteDriver Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting FavoriteDriver"
            });
        }
    }
};