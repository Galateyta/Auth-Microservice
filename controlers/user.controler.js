const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const key = { tokenKey: "djghhhhuuwiwuewieuwieuriwu" };
const uuidv4 = require('uuid/v4');
const log4js = require('log4js');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');

dotenv.config();
const logger = log4js.getLogger();
logger.level = "debug";
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

let resetPassword = async function (req, res) {
    const url = 'http://localhost:3000';
    if (!req.body) {
        return res.sendStatus(400);
    }
    const email = req.body.email;
    const newPass = uuidv4();
    const cryptPass = bcrypt.hashSync(newPass, 10);
    let mailOptions = {
        from: 'authorisation.app@gmail.com',
        to: email,
        subject: 'Forgot password',
        html: `Your new password is:${newPass}<br>  Please click this to login with your new password: <a href="${url}">Go to login page</a>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Transport the message: ${mailOptions}`)
        const info = await User.findOne({ "email": email });
        if (!info) {
            logger.error(`Not found user to reset password, email: ${email}`)
            return res.status(404).json({ message: "User not found" });
        }
        const data = await User.updateOne({ "email": info.email }, { "password": cryptPass });
        logger.info(`User to reset password: ${info}`);
        if (data) {
            logger.info(`User password updated(reset): ${data}`);
            return res.status(200).json({
                message: "Successfully reseted password"
            });
        }
        logger.error(`User not found to reset password`);
        return res.status(404).json({ message: "User not found" });
    } catch (error) {
        logger.error(`Reset password error: ${error}`);
        return res.status(204).json(error);
    }
}

let changePassword = async function (req, res) {
    if (req.body) {
        logger.info(`Change password requset body is exist: ${req.body}`);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        const password = req.body.password;
        const newPass = bcrypt.hashSync(req.body.newPassword, 10);
        const token = req.headers.token;
        if (token && password && newPass) {
            logger.info(`Change password token, old and new passwords are exist:
                 ${token} ${password} ${newPass}`);
            try {
                const info = await User.findOne({ "token": token });
                if (!info) {
                    logger.error('Change password error, user not found');
                    return res.status(404).json({ message: "User not found" });
                } else if (token == info.token && bcrypt.compareSync(password, info.password)) {
                    const data = await User.updateOne({ "token": info.token }, { "password": newPass });
                    logger.info('Succesfully changed password');
                    return res.status(200).json({
                        message: "Successfully changed password"
                    });
                }
            } catch (err) {
                logger.error(`Change password error: ${err}`);
                return res.status(204).json(err);
            }
        } else {
            logger.error('Change password, not valid email or password');
            return res.status(403).json({ message: "Not valid email or password" });
        }
    } else {
        logger.error(`Change password request body is empty`);
        return res.status(202).json({ message: "Empty data!" })
    }
}

let loginUser = async function (req, res) {
    if (req.body) {
        logger.info(`Login user requset body is exist: ${req.body}`);
        const email = req.body.email;
        const password = req.body.password
        if (email && password) {
            logger.info(`Login user email & password is exist: ${email} : ${password}`);
            try {
                const info = await User.findOne({
                    "email": email
                });

                if (!info) {
                    logger.error(`Login user not found, email: ${email}`);
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                logger.info(`Login user founded: ${email}`);
                if (bcrypt.compareSync(password, info.password)) {
                    if (!info.isVerified) {
                        logger.error(`Account is not verified : ${info}`);
                        return res.status(403).json({ message: 'Account is not verified' });
                    }
                    const token = jwt.sign({ userId: info._id }, key.tokenKey, { expiresIn: "2h" });
                    try {
                        const user = await User.updateOne({ _id: info._id }, {
                            $set: { token: token }
                        })
                        info.token = token;
                        logger.info(`User succesfully sighn in: ${info}`);
                        res.status(200).json(info);
                    } catch (error) {
                        logger.error(`Password is not valid: ${error}`);
                        return res.status(400).json(error);
                    }
                } else {
                    logger.error(`Error to login user`);
                    return res.status(401).json({ message: 'Password is not valid' });
                }

            } catch (err) {
                logger.error(`Error to login user: ${err}`);
                return res.status(204).json(err);
            }
        } else {
            logger.error(`Not valid user email or password to login, email: ${email}, password : ${password}`);
            return res.status(403).json({
                message: "Not valid email or password"
            });
        }
    } else {
        logger.error(`Login request body is empty`);
        return res.status(202).json({
            message: "Empty data!"
        })
    }
}

let emailConfirmation = async function (req, res) {
    try {
        const user = await User.updateOne({ confirmToken: req.params.token },
            { $set: { isVerified: true, confirmToken: '' } });
        logger.info(`Email confirmation, user : ${user}`);
        res.status(200).json(user);
    } catch (err) {
        logger.error(`Email confirmation error: ${err}`);
        res.status(404).json({ message: 'Email confirmation failed' });
    }
}

let userPostFunction = async function (req, res) {
    if (!req.body) {
        logger.error(`User registration request body is not exist`);
        return res.sendStatus(400);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }

    try {
        const emailUser = await User.findOne({ "email": req.body.email });
        if (emailUser) {
            return res.status(409).json({ message: 'Email is already exists' })
        }
    } catch (error) {
        return res.status(404).json({ error: error })
    }
    const userName = req.body.name;
    const userEmail = req.body.email;
    const hash = bcrypt.hashSync(req.body.password, 10);
    const userId = uuidv4();
    const confirmToken = uuidv4();
    const token = '';
    const url = `http://localhost:8080/signup/confirmation/${confirmToken}`;


    let mailOptions = {
        from: 'authorisation.app@gmail.com',
        to: '',
        subject: 'Confirm Email',
        html: `Please click this email to confirm your email: <a href="${url}">Confirm your account</a>`,
    };

    const user = new User({
        id: userId,
        name: userName,
        password: hash,
        email: userEmail,
        confirmToken: confirmToken,
        token: token
    });

    logger.info(`New user for registration: ${user}`);
    try {
        const result = await user.save();
        logger.info(`Succesfully registrated user: ${user}`);
        res.send(result);
    } catch (error) {
        logger.error(`User ragistration error : ${error}`);
        res.status(422).json({
            message: error.message
        });
    }
    mailOptions.to = req.body.email;
    try {
        logger.info(`Send mail to verify account, mailOptions: ${mailOptions}`);
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(`Error to send Mail: ${error}`);
        res.status(403).json({ message: 'Email sendin failed' });
    }

}
module.exports.userPostFunction = userPostFunction;
module.exports.emailConfirmation = emailConfirmation;
module.exports.loginUser = loginUser;
module.exports.changePassword = changePassword;
module.exports.resetPassword = resetPassword;