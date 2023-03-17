const express = require('express');
const userSWSController = require('./../controllers/userSWSController');


const router = express.Router();




router.post('/registrationSWS',userSWSController.registrationSWS);
//router.route('/').post(userSWSController.registrationSWS)


module.exports = router;