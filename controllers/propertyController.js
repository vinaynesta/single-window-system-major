const property = require('./../models/propertyOwned');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');


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
// exports.updatePropertyPop = catchAsync(async (req,res,next) => { 
   
//     const prop = await property.find({status:1});
//     for(i=0;i<prop.length;i++){
//       const prop1  = await User.findByIdAndUpdate(req.user.id,
//         {
//           $push:{
//             transactions:prop[i].id
//           }
//         },{new:true}
//       )
//       let a = prop[i]._id
//       const prop2 = await property.findByIdAndUpdate(a,{status:0},{new:true})
//       console.log(prop2.data);
//     }
    
    
//     //console.log(prop.length,"blueeeeeeeeeeeeeeeeeeee");
//     //   if (!doc) {
//     //     return next(new AppError('No document found with that ID', 404));
//     //   }
  
//       res.status(200).json({
//         status: 'success',
//         // data: doc
//       });

//       next()
// } )


exports.getOneProperty =factory.getOne(property);

exports.getAllProperties =factory.getAll(property);

exports.delProperty = factory.deleteOne(property);  