const express = require('express');
const userSWSController = require('./../controllers/userSWSController');
const authController = require('./../controllers/authController');

const router = express.Router();




router.post('/registrationSWSS',userSWSController.registrationSWS);



module.exports = router;