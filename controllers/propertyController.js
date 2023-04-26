const property = require('./../models/propertyOwned');
const rates = require('../models/interestRates');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const { details } = require('./viewsController');
const cv = require('opencv4nodejs-prebuilt');


exports.createProperty = factory.createOne(property);

exports.updateProperty = catchAsync(async (req,res,next) => { 
    //console.log(req.body);
    const doc = await property.findByIdAndUpdate(req.query.id, req.body, {
        new: true,
        runValidators: true
      });
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: doc
      });

      next()
} )


exports.getOneProperty =factory.getOne(property);

exports.getAllProperties =factory.getAll(property);

exports.delProperty = factory.deleteOne(property);  

exports.submitproperty = catchAsync( async(req,res) => {
  const data1 = new property({
    zoneId: req.body.zoneId,
    baseValue: req.body.baseValue,
    buildingClassification: req.body.buildingClassification,
    floorNo: req.body.floorNo,
    occupancy: req.body.occupancy,
    area: req.body.area,
    constructionDate: req.body.construction,
    natureOfUsage: req.body.natureOfUsage,
    user: req.body.aadharId,
     });
     
    const zoneId = req.body.zoneId;
    const baseValue= req.body.baseValue;
    const buildingClassification= req.body.buildingClassification;
    const floorNo= req.body.floorNo;
    const occupancy= req.body.occupancy;
    const area= req.body.area;
    const natureOfUsage= req.body.natureOfUsage;
    const user= req.body.aadharId;
    
    
    rates.find({zoneId:zoneId},function(err,details){
      let cal =0;
      console.log("details",details[0][buildingClassification]);
      cal=details[0][buildingClassification]*baseValue*area*details[0][occupancy];
      console.log("type",typeof cal,cal);
      data1.tax=cal/1000;
      data1.save();
   
      res.redirect('/account');
    })
    
  
});

exports.transferProperty = catchAsync( async(req,res) => {
  const senderaadhar = req.body.senderaadhar;
  const receiveraadhar = req.body.receiveraadhar;
  const propertyid = req.body.propertyid;
  console.log("s",senderaadhar);
  console.log("r",receiveraadhar);

  await property.findOneAndUpdate({_id:propertyid,user:senderaadhar},{$set:{user:receiveraadhar}});
  
  console.log("p",propertyid);
  res.redirect("/account");

  });

  