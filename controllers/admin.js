const http_status_codes = require('http-status-codes');
const hashedpassword = require("password-hash");
const sequelize = require("sequelize");
const op = sequelize.Op;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const {
    Admin
} = require('../database/database');
module.exports = {

    async createAdmin(req, res, next) {

        try {
            const {
                name,
                email,
                password
            } = req.body;
            const admin = await Admin.findAll({ where: { email: email } });
            if (admin.length > 0) {
                res.json({ message: "This Admin already exists" });
            } else {
                const adminCreated = Admin.create({
                    adminName: name,
                    password: hashedpassword.generate(password),
                    email: email,
                    isSuperAdmin: true
                });
                if (adminCreated) {
                    const token = jwt.sign({
                        email: req.body.email,
                        adminId: adminCreated.id
                    },
                        "very-long-string-for-secret", {
                        expiresIn: 3600
                    }
                    );
                    res.json({
                        message: "Admin is Created Successfully",
                        accessToken: token,
                        admin: adminCreated,
                        expiresIn: '3600',
                        role: 'admin'
                    })
                }
            }

        } catch (err) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Error Occurd in Creating createAdmin",
                err: err
            });
        }
    },

    signinAdmin(req, res, next) {

        try {
            const {
                email,
                password,
            } = req.body;

            Admin.findOne({
                where: {
                    email: email
                },
            }).then(isAdminExist => {
                if (isAdminExist) {
                    const verify_password = hashedpassword.verify(
                        password, isAdminExist.password
                    );
                    if (verify_password) {
                        const token = jwt.sign({
                            email: email,
                            adminId: isAdminExist.id
                        },
                            "very-long-string-for-secret", {
                            expiresIn: 3600
                        }
                        );

                        res.json({
                            message: "successfully login",
                            accessToken: token,
                            admin: isAdminExist,
                            expiresIn: '3600',
                            role: 'admin'
                        })
                    } else {
                        res.json({
                            message: 'Invalid credentials'
                        })
                    }
                } else {
                    res.json({
                        message: 'Invalid credentials'
                    });
                }
            })
        } catch (error) {
            return res.status(http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'error in signinAdmin'
            });
        }
    },

    async updatePassword(req, res, next) {
        try {
            id = req.params.id;
            const {
                password
            } = req.body

            Admin.update({
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
        Admin.findOne({
            where: { email: reqData.email }
        }).then(isAdmin => {
            if (isAdmin) {
                // send email
                var adminMail = req.body.email;
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
                    to: adminMail, // list of receivers
                    subject: 'Admin Password Verification Code', // Subject line
                    text: 'Here is a code to setup your password again', // plain text body
                    html: 'Hi Dear Admin <br>Please verify your email using the link below and get back your password! <b style="font-size:24px;margin-left:30px"> Your code - ' + rand + '<b>' // html body

                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.json('error occured')
                    } else {
                        res.json({
                            admin: isAdmin,
                            verificationCode: rand
                        });
                    }
                });

            } else {
                res.json({ message: "Email does not exit" });
            }
        }).catch(err => {
            console.log(err);
            res.json("Some Error Occured!");
        });
    },
};