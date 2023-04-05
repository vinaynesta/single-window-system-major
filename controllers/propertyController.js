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

    data1.save();
    res.send(data1);

    const wordsArray = data1.objective.split(" ");
    console.log("wordsArray",wordsArray);
    const wordsSet = new Set(wordsArray);
    console.log("wordsSet",wordsSet);

    const results = [];
    // let name1 = "vinay";

  for(let val of wordsSet){
    let name2 = val;
    for( let i=0 ;i<=1516;i++){
      console.log("name2",i," ",name2);
      const similarity = stringSimilarity.compareTwoStrings(delta[i]['jigaboo'].toLowerCase(), name2.toLowerCase());
      console.log("score : ",i+" "+similarity);
      if(similarity ==1 ){
        results.push({word :name2,sim:similarity});
        // results.data[i].name= similarity;
      }
    }
  }
  console.log("results",results , results.length);
   if(results.length == 0){
     data1.status="Approved";
     data1.save();
    res.send("Approved");
   }
   else{
    data1.status="Rejected";
    data1.save();
    res.send("Rejected");

   }
    res.redirect("/account");

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