const express = require('express');
const propertyController = require('./../controllers/propertyController');
const authController = require('./../controllers/authController');

const router = express.Router();



router.route('/')
.get(propertyController.getAllProperties)
.post(authController.protect,authController.restrictTo(),propertyController.createProperty)
.patch(authController.isLoggedIn,authController.protect,propertyController.updateProperty)



module.exports = router;
