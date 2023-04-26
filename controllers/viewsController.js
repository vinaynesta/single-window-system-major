
const User = require('../models/userModel');
const UserSWS = require('../models/userSWSModel');
const Rates = require('../models/interestRates');
const Property = require('../models/propertyOwned');
const Ledger = require('../models/ledgerModel');
const catchAsync = require('./../utils/catchAsync');
const zone=require('./../models/interestRates');


exports.getIndex = catchAsync( async (req,res,next) => {
  
    res.status(200).render('index',{
        title: '',
    });
});

exports.getLoginForm = catchAsync( async(req,res)=> {
  res.render('login',{
    title: '| Login',
  })
});

exports.getSignUpForm = catchAsync( async(req,res)=> {
  res.render('signup',{
    title: '| Sign up',
  })
});


exports.getAccount = catchAsync( async(req,res)=> {
  
  res.render('account',{
    title: 'Account',
  })
})
exports.getProfile = catchAsync( async(req,res)=> {
  res.render('profile',{
    title: ' ',
  })
})
exports.getPayment = catchAsync( async(req,res)=> {
  res.render('payment',{
    title: ' | Payment',
  })
})



exports.privatekey = catchAsync( async(req,res)=> {
  let doc = await Property.findById(req.query.id);
  
  res.render('privatekey',{
    title: 'privatekey',
    tax:doc.tax
  })
})

exports.orders = catchAsync( async(req,res)=> {

  let a = res.locals.user
  let order = a.orders

  res.render('orders',{
    title: ' pay',
    orders:order
  })
})

exports.ledgerr = catchAsync( async(req,res)=> {

  let doc = await Ledger.find({});
  // console.log(doc);
  res.render('ledger',{
    title: ' pay',
    doc:doc
  })
}) 

exports.assets = catchAsync( async(req,res)=> {
  let doc = await Property.find({user:req.user.id}).sort({status:-1});
  
  //console.log(doc);
  var date=new Date();
  
  for(let i=0;i<doc.length;i++){
      let k = await zone.find({zoneId:doc[i].zoneId});
      var base=doc[i].baseValue/100;
      var area=doc[i].area/1000;
      var da=date.getFullYear()-doc[i].constructionDate.getFullYear();
      //console.log(date.getFullYear(),doc[i].constructionDate.getFullYear(),da);
      var bu=doc[i].buildingClassification;

      var nu=doc[i].natureOfUsage;
      var fn=doc[i].floorNo
      let docc = k[0]
      //console.log(docc);
      for(key in docc){
        if(key == bu){
          bu = docc[key];
        }
        if(key == nu){
          nu = docc[key]
        }
        if(key == `floor${fn}`){
          fn = docc[key]
        }
      }
        var p=base*area*da*bu*nu*fn;
        p=p.toFixed(2);
        console.log(req.user._id,);
        await Property.findByIdAndUpdate(doc[i].id,{tax:p},{new: true})
     

    }
    await User.findByIdAndUpdate(req.user.id,{status:1},{new: true})
      
  res.render('assets',{
    title: ' assets',
    doc:doc
  })
}) 

exports.propertyTransfer = catchAsync( async(req,res)=> {
  
  res.render('propertytransfer',{
    title: '| Property Transfer',
    
  })
});

exports.moaaoa = catchAsync( async(req,res)=> {
  
  res.render('moaaoa',{
    title: '| moaaoa',
    
  })
});



exports.registrationSWS = catchAsync( async(req,res)=> {
 
  res.render('registrationSWS',{
    title: '| registrationSWS',
    //doc:doc
  })
  console.log("lll" ,req.body);
  console.log("love you beb");
});

exports.zonedetails = catchAsync( async(req,res)=> {
  let doc = await Rates.find({});
  res.render('zonedetails',{
    title: '| zonedetails',
    doc:doc
  })
});
exports.features = catchAsync( async(req,res)=> {
  
  res.render('features',{
    title: '| features',
  })
});
exports.invoice = catchAsync( async(req,res)=> {
  let doc = await Property.findById(req.query.id);
  let user = await User.findById(doc.user)

  res.render('invoice',{
    title: '| invoice',
    doc:doc,
    user:user
  })
});
exports.transaction = catchAsync( async(req,res)=> {
  let doc = await Property.find({user:req.user.id}).sort({status:-1});
  res.render('transaction',{
    title: '| transaction',
    doc:doc
  })
});
exports.paid = catchAsync( async(req,res)=> {
  let doc = await User.find({status:1})
  res.render('paid',{
    title: '| paid',
    doc:doc,
  })
  console.log(doc);
});
exports.unpaid = catchAsync( async(req,res)=> {
  let doc = await User.find({status:-1})
  res.render('unpaid',{
    title: '| unpaid',
    doc:doc,
  })
});

exports.details = catchAsync( async(req,res)=> {
  
  res.render('details',{
    title: '| details',
  })
});

exports.namesMatch = catchAsync( async(req,res)=> {
  res.render('namesMatch',{
    title: '| namesMatch',
  })
});

exports.upload = catchAsync( async(req,res)=> {
  res.render('upload',{
    title: '| upload',
  })
});

exports.uploadmom = catchAsync( async(req,res)=> {
  res.render('uploadmom',{
    title: '| uploadmom',
  })
});

exports.namesResults = catchAsync( async(req,res)=> {
  res.render('namesResults',{
    title: '| namesResults',
  })
});

exports.momresults = catchAsync( async(req,res)=> {
  res.render('momresults',{
    title: '| momresults',
  })
});

exports.registration = catchAsync( async(req,res)=> {
  res.render('registration',{
    title: '| registration',
  })
});

exports.companyTransfer = catchAsync( async(req,res)=> {
  res.render('companyTransfer',{
    title: '| companyTransfer',
  })
});

exports.image = catchAsync( async(req,res)=> {
  res.render('image',{
    title: '| image',
  })
});

exports.stamp = catchAsync( async(req,res)=> {
  res.render('stamp',{
    title: '| stamp',
  })
});