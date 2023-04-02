const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const bcrypt = require('bcryptjs');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const UserSWS = require('../models/userSWSModel');
const nodemailer = require('nodemailer');
const natural = require('natural');



// import { JaroWinklerDistance } from 'natural';
const csv = require('csv-parser');
const fs = require('fs');

// Define the path to the CSV file
const csvFilePath = './public/data/requiredData.csv';

// Create an empty array to store the data
const data = [];

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
        subject: 'New form submission',
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
    // Normalize company names by removing punctuation and converting to lowercase
    let name1 = req.body.name1 || "";
    let name2 = req.body.name2 || "";

    const results = [];

    console.log("name1 , name2 : ",name1 ,name2);
    console.log("names",data[1].name);

    name1 = name1.replace(/[ -\/]/g, "");
    console.log("1",name1);
    name1 = (name1 || "").toLowerCase();
    console.log("1",name1);
    name2 = name2.replace(/[^\w\s]/g, '');
    name2 = (name2 || "").toLowerCase();
    // name1 = name1.toLowerCase();
  
    // Calculate Jaro-Winkler distance between the two company names
    // for( let i=0 ;i<=1000;i++){
    //     console.log("data "+i+" ",data[i].name);
    // }
    const similarityScore = natural.JaroWinklerDistance(name1, name2);
    console.log("score : ",similarityScore);
    res.redirect('/account');
  });