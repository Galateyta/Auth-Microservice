const express = require('express');
const router = express.Router();
const controller = require('../controlers/user.controler')

router.route('/')
    .post(controller.userPostFunction );

module.exports = router;
