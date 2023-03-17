const mongoose = require('mongoose');
const dotenv = require('dotenv');

const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: './config.env'});
const app = require('./app');

const db = process.env.DATABASE2.replace('<password>',process.env.DATABASE_PASSWORD2);
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(con =>{console.log('Data base connected successfully');});

const port =  process.env.PORT || 8080;



const server = app.listen(port, function(){
    console.log('Server Active on', port);
  });

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
});

let bucket;
mongoose.connection.on("connected", () => {
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "newBucket"
  });
  //console.log(bucket);
});

//heroku ps:scale web=0
//heroku ps:scale web=1