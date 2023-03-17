const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const UserSWS = require('../models/userSWSModel');


exports.getAllUsers = factory.getAll(UserSWS);


exports.registrationSWS = catchAsync( async(req,res,next) => {
    

    console.log("happy life");

    const data = new UserSWS({
        userNameSWS: req.body.userNameSWS,
        age: req.body.age,
        mobileNumber: req.body.mobileNumber,
        favColor: req.body.favColor,
        occupation: req.body.occupation,
         });
    
    console.log('req body',req.body)
    
    console.log("data",data)

    data.save();

    res.redirect('/account');
    
})