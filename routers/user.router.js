const express = require('express');
const router = express.Router();
const controller = require('../controlers/user.controler')

router.route('/signup')
    .post(controller.userPostFunction);
router.route('/signup/confirmation/:token')
    .get(controller.emailConfirmation);
router.route('/signin')
    .post(controller.loginUser);
module.exports = router;
