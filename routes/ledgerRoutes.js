const express = require('express');

const authController = require('./../controllers/authController');
const ledgerController = require('./../controllers/ledgerController');



const router = express.Router();

router.route('/')
.post(ledgerController.createTransaction)
//.get(authController.isLoggedIn,authController.protect,ledgerController.createTransaction)


module.exports = router; 
