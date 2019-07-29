const express = require('express');
const router = express.Router();
const controller = require('../controlers/user.controler')
const { check } = require('express-validator');

router.route('/signup')
    .post([check('name').matches(/^[A-Z]{1}[a-z]{1,}$/).withMessage('Names first simbol must upper'),
    check('email').isEmail(),
    check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage('Password must be contain at least one uppercase character, one lowercase character and one ')],
        controller.userPostFunction);
router.route('/signup/confirmation/:token')
    .get(controller.emailConfirmation);
router.route('/signin')
    .post(controller.loginUser);
router.route('/change')
    .post([check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).withMessage('Password must be contain at least one uppercase character, one lowercase character and one ')],
        controller.changePassword);
router.route('/resetpass')
    .post(controller.resetPassword)
module.exports = router;