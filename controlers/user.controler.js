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

let loginUser = async function (req, res) {
    console.log('body', req.body);
    if (req.body) {
        const email = req.body.email;
        const password = req.body.password

        if (email && password) {
            try {
                const info = await User.findOne({
                    "email": email
                });
                console.log('info', info);
                let response = {};
                if (!info) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                } else {
                    console.log('infopassword', info.password)
                    if(bcrypt.compareSync(password, info.password)){
                        console.log(password);
                            const token = jwt.sign({
                                userId: info._id
                            }, key.tokenKey, {
                                    expiresIn: "2h"
                                });
                            response.id = info._id;
                            response.email = info.email;
                            response.token = token;

                            User.updateOne({
                                _id: response._id
                            }, {
                                    $set: {
                                        token: response.token
                                    }
                                })
                                .then(result => {
                                    console.log(response);
                                    return res.status(200).json(response);
                                }).catch(err => {
                                    return res.status(400).json(err);

                                })
                        }
                    }
            } catch (err) {
                console.log(err);
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

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
        console.log(user);
    } catch (error) {
        console.log(error);
    }
    console.log(user)
}
module.exports.userPostFunction = userPostFunction;
module.exports.emailConfirmation = emailConfirmation;
module.exports.loginUser = loginUser;

