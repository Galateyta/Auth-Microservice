const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

let userPostFunction = async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    if (!req.body || !req.body.password) return res.sendStatus(400);
    const userId = req.body.id;
    const userName = req.body.name;
    const userSurname = req.body.surname;
    const userAge = req.body.age;
    const userGender = req.body.gender;
    const userEmail = req.body.email;
    const userRole = req.body.role;
    const hash = bcrypt.hashSync(req.body.password, 10);


    const user = new User({
        id: userId,
        name: userName,
        surname: userSurname,
        age: userAge,
        gender: userGender,
        password: hash,
        email: userEmail,
        role: userRole
    });
    console.log(user);

    try {
        const result = await user.save();
        res.send(result);

    } catch (error) {
        res.status(422).json({
            message: error.message
        });

    }
}
module.exports.userPostFunction = userPostFunction;
