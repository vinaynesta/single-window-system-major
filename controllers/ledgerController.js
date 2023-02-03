const ledger = require('./../models/ledgerModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const APIFeatures = require('./../utils/apiFeatures');


// current date, receiver's public address
exports.createTransaction = catchAsync( async(req,res,next) => {
    //console.log(req.body);

    let coins = req.body.amount
    let d = new Date();
    let sender = req.body.senderPublicAddress
    // gives previous hash
    let doc = await ledger.find({});
    doc = doc.slice(-1)
    const prevHash = doc[0].hashValue
    
    const k = d+prevHash+coins+sender

    // Hash the  with cost of 12
    const currHash = await bcrypt.hash(k, 12);
    
    // //console.log(currHash); //present hash

    const data = {
        previousHashValue: prevHash,
        receiverPublicAddress:"6307530597c871b934c42978",
        hashValue: currHash,
        amount:req.body.amount,
        senderPublicAddress:req.body.senderPublicAddress
    }
    const doc1 = await ledger.create(data);
        res.status(201).json({
            status:'success',
            data: doc1
        });
    next();
})
