const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const UserSWS = require('../models/userSWSModel');
const nodemailer = require('nodemailer');
const Result = require('../models/namesModel');
const mom = require('../models/momModel');
// const natural = require('natural');
// const mongoose = require('mongoose');
const GLalgorithm = require('string-similarity');



// import { JaroWinklerDistance } from 'natural';
const csv = require('csv-parser');
const fs = require('fs');

// Define the path to the CSV file
const csvFilePath = './public/data/requiredData.csv';
const csvFilePathClean = './public/data/requiredDataClean.csv';
const csvFilePathDelta = './public/data/delta.csv';

// Create an empty array to store the data
const data = [];
const dataclean = [];
const delta = [];

// Use the csv-parser module to read the file and convert it to a JavaScript object
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
    console.log(data); // The parsed data will be stored in this array
  });

fs.createReadStream(csvFilePathClean)
.pipe(csv())
.on('data', (row) => {
  dataclean.push(row);
})
.on('end', () => {
  console.log('CSV file successfully processed clean.');
  console.log(dataclean); // The parsed data will be stored in this array
});

fs.createReadStream(csvFilePathDelta)
.pipe(csv())
.on('data', (row) => {
  delta.push(row);
})
.on('end', () => {
  console.log('CSV file successfully processed delta.');
  console.log(delta); // The parsed data will be stored in this array
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
    auth: {
      user: 'vinaynesta2002@gmail.com',
      pass: 'cmpzjjtsjghcfbxk'
    }
  });


exports.getAllUsers = factory.getAll(UserSWS);

// const resultSchema = new mongoose.Schema({
//   resultData : Array,
// });

// const Result = mongoose.model('Result', resultSchema);

// module.exports = Result;

exports.registrationSWS = catchAsync( async(req,res) => {
    

    console.log("happy life");

    const data = new UserSWS({
        userNameSWS: req.body.userNameSWS,
        age: req.body.age,
        mobileNumber: req.body.mobileNumber,
        favColor: req.body.favColor,
        occupancy: req.body.occupancy,
         });

    const message = "We are here to notify you that ,we have received an application for the DIN from you. we will notify youn once the application is processed. Please, be patience for the reply.";

    const mailOptions = {
        from: 'vinaynesta2002@gmail.com',
        to: 'dvinay.19.cse@anits.edu.in',
        subject: 'DIN form submission',
        html: `<p>Name: ${data.userNameSWS}</p><p>Age: ${data.age}</p><p>Message: ${message}</p><p>Thank You</p><p>Regards</p><p>MCA</p>`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log(error);
        res.send('Error: Could not send email');
        } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent');
        }
    });
    
    console.log('req body',req.body)
    
    console.log("data",data)

    data.save();

    res.redirect('/account');
    
})



exports.compareCompanyNames = catchAsync( async(req, res)=> {
  
  let name1 = req.body.name1;
  
    const results = [];
    console.log("names c",dataclean[1].name);


    for( let i=0 ;i<=10645;i++){
        let name2 = dataclean[i].name;
        const similarity = GLalgorithm.compareTwoStrings(name1.toLowerCase(), name2.toLowerCase());
        console.log("score : ",i+" "+similarity);
        if(similarity >= 0.3){
          results.push({nam :data[i].name,sim:similarity});
          // results.data[i].name= similarity;
        }
    }
    
    console.log("result: ",results);

    const resulted = new Result({
      resultData : results,
    })

    resulted.save();

    // res.render("namesMatch",{results});
    res.render("namesResults",{requesterDetails:results});
    
    // res.send(results);
  });

  exports.getAllResults = catchAsync(async(req,res)=>{

    Result.find({},function(err,details){

      console.log("result",requester);
      res.render("namesResults",{requesterDetails : details});
    });

  });


  exports.submitmom = catchAsync( async(req,res) => {
    const data1 = new mom({
      name: req.body.name,
      email: req.body.email,
      sector: req.body.sector,
      state: req.body.state,
      objective: req.body.objective,
      liability: req.body.liability,
      capital: req.body.capital,
       });
  
      // data1.save();
  
      const wordsArray = data1.objective.split(" ");
      console.log("wordsArray",wordsArray);
      const wordsSet = new Set(wordsArray);
      console.log("wordsSet",wordsSet);

      const results = [];
      // let name1 = "vinay";

    for(let val of wordsSet){
      let name2 = val;
      for( let i=0 ;i<=1631;i++){
        console.log("name2",i," ",name2);
        const similarity = GLalgorithm.compareTwoStrings(delta[i]['jigaboo'].toLowerCase(), name2.toLowerCase());
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