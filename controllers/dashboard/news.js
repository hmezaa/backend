const http_status_codes = require('http-status-codes');
const {
    City,
    News
} = require('../../database/database');
module.exports = {

    async createNews(req, res, next) {
        try {
            const {
                description,
                title,
                image,
                cityId
            } = req.body;
            const news = await News.create({
                description: description,
                title: title,
                image: image,
                cityId: cityId
            });
            return res.status(http_status_codes.StatusCodes.CREATED).json(news);
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Creating News",
                err: err
            });
        }
    },

    async updateNews(req, res, next) {
        try {
            const {
                description,
                title,
                image,
                cityId
            } = req.body;

            const newsId = req.params.newsId;
            const news = await News.update({
                title: title,
                description: description,
                image: image,
                cityId: cityId

            }, {
                where: {
                    id: newsId
                }
            });
            return res.status(http_status_codes.StatusCodes.OK).json({
                message: 'News Updated Successfully'
            });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Updating News",
                err: err
            });
        }
    },

    async getNews(req, res, next) {
        try {
            const newsId = req.params.newsId;
            const news = await News.findOne({ where: { id: newsId } });
            return res.status(http_status_codes.StatusCodes.OK).json(News);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching News",
                err: err
            });
        }
    },

    async getAllNews(req, res, next) {
        try {
            const news = await News.findAll({ order: [['createdAt', 'DESC']], include: { model: City, attributes: ['cityName'] } });
            return res.status(http_status_codes.StatusCodes.OK).json(news);
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Fetching All News",
                err: err
            });
        }
    },


    async deleteNews(req, res, next) {
        try {
            const newsId = req.params.newsId;
            const news = await News.destroy({ where: { id: newsId } });
            return res.status(http_status_codes.StatusCodes.OK).json({ message: 'News Deleted Successfully' });
        }
        catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Deleting News",
                err: err
            });
        }
    }
};