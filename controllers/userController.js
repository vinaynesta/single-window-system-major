const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//   destination: (req,file,cb) => {  // cb-- callback
//     cb(null,'public/img/users');
//   },
//   filename: (req,file,cb) => {
//     const ext = file.mimetype.split('/')[1]; // extention -- jpe,png
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`); 
//   }
// });

const multerStorage = multer.memoryStorage(); // stored as buffer

const multerFilter = (req,file,cb)=> {
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }
  else{
    cb(new AppError('Not an Image. Please Upload an image',400),false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync( async (req,res,next) => {
  if(!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`);

  next(); 
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
    //console.log(req);
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    //const filteredBody = filterObj(req.body,'email','name');  // we can only change these 3 
    const filteredBody = req.body  // we can only change these 3 
    
    if(req.file){
      filteredBody.photo=req.file.filename;
    }
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
});

exports.updateCoins = catchAsync(async (req,res,next) => {
  //console.log("hiii");
  let sentCoins = req.body.sentCoins
  let name = req.body.name

  let receiverDoc = await User.findById(req.body.receiverPublicAddress);
  let receiverBal = receiverDoc.coinBalance
  let receiverTot = receiverBal + sentCoins 
  console.log(receiverBal,receiverTot);

  // const newReceiverDoc = await User.findByIdAndUpdate(req.body.receiverPublicAddress,
  //   {coinBalance: receiverTot,}, {
  //   new: true
  // });



  const newReceiverDoc = await User.updateOne({_id:req.body.receiverPublicAddress},
    {coinBalance: receiverTot,$push:{orders:{price:sentCoins,name:name,coinSent:0,coinReceived:sentCoins,balance:receiverTot,to:0,from:req.body.senderPublicAddress}}}
    )
  
  console.log("r",receiverBal,newReceiverDoc);

  let senderDoc = await User.findById(req.body.senderPublicAddress);
  let senderBal = senderDoc.coinBalance
  let senderTot = senderBal - sentCoins 
console.log(senderBal,senderTot);
  // const newSenderDoc = await User.findByIdAndUpdate(req.body.senderPublicAddress,
  //   {coinBalance: senderTot,},{new: true});

  const newSenderDoc = await User.updateOne({_id:req.body.senderPublicAddress},
    {coinBalance: senderTot,$push:{orders:{price:sentCoins,name:name,coinSent:sentCoins,coinReceived:0,balance:senderTot,to:0,from:req.body.receiverPublicAddress}}}
    )
  
  console.log("s",senderBal,newSenderDoc);

  res.status(201).json({
    status: 'success',
    data: {
      sender: newSenderDoc,
      receiver: newReceiverDoc
    }
  });


  
  next()
})

exports.updateCash = catchAsync(async (req,res,next) => {

  let sentCash = req.body.sentCash

  let receiverDoc = await User.findById(req.body.receiverPublicAddress);
  let receiverBal = receiverDoc.balance
  let receiverTot = receiverBal + sentCash

  const newReceiverDoc = await User.findByIdAndUpdate(req.body.receiverPublicAddress,{balance: receiverTot}, {
    new: true
  });
  //console.log("r",receiverBal,newReceiverDoc);

  let senderDoc = await User.findById(req.body.senderPublicAddress);
  let senderBal = senderDoc.balance
  let senderTot = senderBal - sentCash 

  const newSenderDoc = await User.findByIdAndUpdate(req.body.senderPublicAddress,{balance: senderTot}, {
    new: true
  });

  //console.log("s",senderBal,newSenderDoc);

  res.status(201).json({
    status: 'success',
    data: {
      sender: newSenderDoc,
      receiver: newReceiverDoc
    }
  });

  next()
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    // we are not actually deleting user from database.. but just making it in active
    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.createUsers = (req,res)=>{

    res.status(500).json({      
        status: 'error',
        message: 'This route is not defined'
    })
};

exports.getMe = (req,res,next)=> {
  req.params.id = req.user.id;
  next();
}


exports.addAssets = catchAsync(async (req,res,next) => {

  const doc = await User.findByIdAndUpdate(req.query.uid,
    {
      $push:{
        assets:req.query.pid
      }
    },{new: true}
    )
  


  res.status(201).json({
    status: 'success',
    data: doc
  });


  
  next()
})

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);
// do not update passwords with this
exports.updateUser = factory.updateOne(User); // only for admin

exports.deleteUser = factory.deleteOne(User);  // only for admin