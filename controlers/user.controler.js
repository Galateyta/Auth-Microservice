const jwt = require('jsonwebtoken');
const key = require("../configs/token.config");

async function loginUser(req, res) {
    if (req.body) {
        const mail = req.body.mail;
        const pass = req.body.password;
        if (mail && pass) {
            try {
                const info = await user.findOne({"mail": mail, "password": pass});
                if (!info) {
                    res.status(404).json({message: "User not found"});
                } else {
                    const token = jwt.sign({userId:user.id}, key.tokenKey);
                    info.token = token;
                    res.status(200).json(info);
                }
            } catch (err) {
                res.status(204).json(err);
            }
        } else {
            res.status(403).json({message: "not valid mail or password"});
        }
    } else {
        res.status(202).json({message: "Empty data!"})
    }
}

module.exports.login = loginUser;