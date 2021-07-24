const http_status_codes = require('http-status-codes');
const {
    City,
    News
} = require('../database/database');
module.exports = {



    async getNews(req, res, next) {
        try {
            const cityName = req.params.cityName;
            console.log(cityName)
            const city = await City.findOne({ where: { cityName: cityName } });
            const news = await News.findAll({ where: { cityId: city.id } });
            return res.status(http_status_codes.StatusCodes.OK).json(news);

        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching getNews",
                err: err
            });
        }
    },


};