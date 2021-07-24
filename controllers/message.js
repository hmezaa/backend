const http_status_codes = require('http-status-codes');
const {

    Message,
    Conversation
} = require('../database/database');
const sequelize = require("sequelize");
const Op = sequelize.Op;
module.exports = {

    async sendMessage(req, res, next) {
        try {
            // console.log(req.body);
            const {
                messageBody,
                senderName,
                receiverName
            } = req.body;
            const senderId = req.params.senderId;
            const receiverId = req.params.receiverId;
            // console.log(senderId);
            // console.log(receiverId);

            const isConExist = await Conversation.findOne({
                where: {
                    [Op.or]:
                        [{
                            [Op.and]:
                                [{ senderId: senderId },
                                { receiverId: receiverId }]
                        },
                        {
                            [Op.and]:
                                [{ senderId: receiverId },
                                { receiverId: senderId }]
                        }]
                }
            });
            // console.log(isConExist);

            if (isConExist) {

                const msg = await Message.create({
                    senderId: senderId,
                    senderName: senderName,
                    receiverId: receiverId,
                    receiverName: receiverName,
                    messageBody: messageBody,
                    conversationId: isConExist.id
                });
                res.json('Message sent successfully');
            } else {
                const con = await Conversation.create({
                    senderId: senderId,
                    receiverId: receiverId
                });
                const msg = await Message.create({
                    senderId: senderId,
                    senderName: senderName,
                    receiverId: receiverId,
                    receiverName: receiverName,
                    messageBody: messageBody,
                    conversationId: con.id
                });
                res.json('Message sent successfully');
            }

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in Sending Message"
            });
        }
    },


    async getAllMessages(req, res, next) {
        try {
            const senderId = req.params.senderId;
            const receiverId = req.params.receiverId;
            const isConExist = await Conversation.findOne({
                where: {
                    [Op.or]:
                        [{
                            [Op.and]:
                                [{ senderId: senderId },
                                { receiverId: receiverId }]
                        },
                        {
                            [Op.and]:
                                [{ senderId: receiverId },
                                { receiverId: senderId }]
                        }]
                }
            });
            if (isConExist) {
                const msgs = await Message.findAll({ where: { conversationId: isConExist.id } });
                res.json(msgs);
            } else {
                res.json('No conversation is started yet!');
            }
        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error Occurd in fetching Conversation"
            });
        }
    },


};