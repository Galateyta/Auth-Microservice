const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const key = { tokenKey: "djghhhhuuwiwuewieuwieuriwu" };
const uuidv4 = require('uuid/v4');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'authorisation.app@gmail.com',
        pass: 'Hunan1996'
    }
});

let resetPassword = async function(req, res) {
    const url = 'http://localhost:3000';
    if (!req.body) return res.sendStatus(400);
    const email = req.body.email;
    const newPass = uuidv4();
    const cryptPass = bcrypt.hashSync(newPass, 10);
    let mailOptions = {
        from: 'authorisation.app@gmail.com',
        to: email,
        subject: 'Forgot password',
        html: `Your new password is:${newPass}<br>  Please click this to login with your new password: <a href="${url}">${url}</a>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        const info = await User.findOne({ "email": email });
        if (!info) {
            return res.status(404).json({ message: "User not found" });
        } else  {
            const data = await User.updateOne({ "email": info.email }, { "password": cryptPass });
            return res.status(200).json({
                message: "Successfully reseted password"
            });
        } 
    } catch (error) {
        return res.status(204).json(error);
    }
}
let changePassword = async function (req, res) {
    if (req.body) {
        const email = req.body.email;
        const password = req.body.password;
        const newPass = bcrypt.hashSync(req.body.newPassword, 10);
        const token = req.headers.token;
        if (token && password && newPass) {
            try {
                const info = await User.findOne({ "email": email });
                if (!info) {
                    return res.status(404).json({ message: "User not found" });
                } else if (token == info.token && bcrypt.compareSync(password, info.password)) {
                    const data = await User.updateOne({ "email": info.email }, { "password": newPass });
                    return res.status(200).json({
                        message: "Successfully changed password"
                    });
                } else {
                    return res.status(302).json({
                        message: "Cant Do this"
                    });
                }
            } catch (err) {
                return res.status(204).json(err);
            }
        } else {
            return res.status(403).json({ message: "Not valid email or password" });
        }
    } else {
        return res.status(202).json({ message: "Empty data!" })
    }
}
let loginUser = async function (req, res) {
    if (req.body) {
        const email = req.body.email;
        const password = req.body.password
        if (email && password) {
            try {
                const info = await User.findOne({
                    "email": email
                });

                if (!info) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                } else {
                    if (bcrypt.compareSync(password, info.password)) {
                        const token = jwt.sign({ userId: info._id }, key.tokenKey, { expiresIn: "2h" });
                        try {
                            const user = await User.updateOne({ _id: info._id }, {
                                $set: { token: token }
                            })
                            res.status(200).json(info);
                        } catch (error) {
                            return res.status(400).json(error);
                        }

                    }
                }
            } catch (err) {
                return res.status(204).json(err);
            }
        } else {
            return res.status(403).json({
                message: "Not valid email or password"
            });
        }
    } else {
        return res.status(202).json({
            message: "Empty data!"
        })
    }
}

let emailConfirmation = async function (req, res) {
    try {
        const user = await User.updateOne({ confirmToken: req.params.token },
            { $set: { isVerified: true, confirmToken: '' } });
        res.send(user);
    } catch (e) {
        res.send('error');
    }
}
let userPostFunction = async function (req, res) {
    if (!req.body || !req.body.password) return res.sendStatus(400);
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
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
    };
    const user = new User({
        id: userId,
        name: userName,
        password: hash,
        email: userEmail,
        confirmToken: confirmToken,
        token: token
    });

    try {
        const result = await user.save();
        res.send(result);

    } catch (error) {
        res.status(422).json({
            message: error.message
        });

    }
    mailOptions.to = req.body.email;
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}
module.exports.userPostFunction = userPostFunction;
module.exports.emailConfirmation = emailConfirmation;
module.exports.loginUser = loginUser;
module.exports.changePassword = changePassword;
module.exports.resetPassword = resetPassword;


