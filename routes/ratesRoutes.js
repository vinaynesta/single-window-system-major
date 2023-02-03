const express = require('express');
const ratesController = require('./../controllers/interestRatesController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/')
.get(authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),ratesController.getAllRates)
.post(authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),ratesController.createRates)
.patch(authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),ratesController.updateRates)

module.exports = router;