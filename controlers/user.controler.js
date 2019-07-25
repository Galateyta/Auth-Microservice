const jwt = require("jsonwebtoken");
const key = require("../configs/token.config");

async function loginUser(req, res) {
    if (req.body) {
        const email = req.body.email;
        const pass = req.body.password;
        if (email && pass) {
            try {
                let info = await user.findOne({"email": email, "password": pass});
                if (!info) {
                    return res.status(404).json({message: "User not found"});
                } else {
                    info.token = jwt.sign({userId: user.id}, key.tokenKey, {expiresIn: "2h"});
                    do {
                        var data = await user.updateOne({_id: info._id}, {$set: {token: info.token}});
                    } while (!data);
                    return res.status(200).json(info);
                }
            } catch (err) {
                return res.status(204).json(err);
            }
        } else {
            return res.status(403).json({message: "Not valid email or password"});
        }
    } else {
        return res.status(202).json({message: "Empty data!"})
    }
}

async function changePassword(req, res) {
    if (req.body) {
        const email = req.body.email;
        const pass = req.body.password;
        const newPass = req.body.newPassword;
        const token = req.body.token;
        if (email && pass && newPass) {
            try {
                const info = await user.findOne({"email": email, "password": pass});
                if (!info) {
                    return res.status(404).json({message: "User not found"});
                } else {
                    if (token === info.token) {
                        do {
                            const data = await user.updateOne({_id: info._id}, {"password": pass});
                        } while (!data);
                        return res.status(200).json({
                            message: "Successfully changed password"
                        });
                    } else {
                            res.status(302).json({
                                message: "Cant Do this"
                            });
                    }
                    return res.status(200).json(info);
                }
            } catch (err) {
                return res.status(204).json(err);
            }
        } else {
            return res.status(403).json({message: "Not valid email or password"});
        }
    } else {
        return res.status(202).json({message: "Empty data!"})
    }
}

module.exports.login = loginUser;
module.exports.changePassword = changePassword;