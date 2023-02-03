const userSWS = require('../models/userSWSModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');


exports.getAllUsers = factory.getAll(userSWS);


exports.registrationSWS = catchAsync( async(req,res,next) => {

    console.log(req.body);

    let name = req.body.userNameSWS
    let age = req.body.age
    let mno = req.body.mobileNumber
    let fcolor = req.body.favColor
    let occu = req.body.occupation
    

    const data = {
        userNameSWS : name,
        age : age,
        mobileNumber : mno,
        favColor : fcolor,
        occupation : occu
    }
    const doc1 = await userSWS.create(data);
        res.status(201).json({
            status:'success',
            data: doc1
        });
        console.log("happy life");
        res.redirect('/account');
    next();
})