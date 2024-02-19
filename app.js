const express = require('express');
const path = require('path');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const multer = require("multer");
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const PDFParser = require('pdf-parse');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const cv = require('opencv4nodejs-prebuilt');
const {PythonShell} = require("python-shell");
const { spawn } = require('child_process');

const jimp = require('jimp');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const userRouter = require('./routes/userRoutes');
const userSWSRouter = require('./routes/userSWSRoutes');
const viewRouter = require('./routes/viewRoutes');
const ledgerRouter = require("./routes/ledgerRoutes")
const propertyRouter = require("./routes/propertyRoutes")
const ratesRoutes = require('./routes/ratesRoutes')
const userController = require('./controllers/userController');
const propertyController = require('./controllers/propertyController');
const userSWSController = require('./controllers/userSWSController');


const properties = require('./models/propertyOwned');
const loginn = require('./models/logininfo');


const csp = require('express-csp');

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));  

app.use(express.static(path.join(__dirname,'/public/')));
app.use(express.static(path.join(__dirname,'/js')));



app.use(helmet());

//compression
app.use(compression());


const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

//e-mail package
const nodemailer = require('nodemailer');

app.use(methodOverride('_method'));

//body and json parsing in express
var bodyParser = require('body-parser');
// var multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ dest: "upload/" });

const pdfSchema = new mongoose.Schema({
  name: String,
  buffer: Buffer,
  contentType: String
});

const Pdf = mongoose.model('Pdf', pdfSchema);

app.post('/upload', upload.single('pdf'), async (req, res) => {
  console.log(req.file);
  const pdf = new Pdf({
    name: req.file.originalname ,
    buffer: req.file.buffer,
    contentType: req.file.mimetype,
  });
  await pdf.save();
  res.send('PDF uploaded successfully');
});



app.use(express.json());

// for parsing application/json

app.use(bodyParser.json()); 

// for parsing application
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


app.use(
  helmet.contentSecurityPolicy({
  directives: {
  defaultSrc: ["'self'", 'https:', 'http:','data:', 'ws:'],
  connectSrc:[ "'self'",' ws:'],
  baseUri: ["'self'"],
  fontSrc: ["'self'", 'https:','http:', 'data:'],
  scriptSrc: [
 "'self'",
 'https:',
 'http:',
 'blob:'],
 AccessControlAllowOrigin: ['self',
 'get',
 'put',
 'data',
 'blob',
 'unsafe-inline',
 'https:','https://download.vcdn.data.here.com/'],
  styleSrc: ["'self'", 'https:', 'http:',"'unsafe-inline'"],
 }
 })
 );

 csp.extend(app, {
  policy: {
      directives: {
          'default-src': ['self'],
          'style-src': ['self', 'unsafe-inline', 'https:'],
          'font-src': [
            'self',
            'data',
            'blob',
            'unsafe-inline',
            'https:',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
            'https://vector.hereapi.com/',
            'https://1.aerial.maps.ls.hereapi.com/',
            'https://1.base.maps.ls.hereapi.com/',
            'https://download.vcdn.data.here.com/'
            
          ],
          'unsafe-eval': [
            'https://js.api.here.com/v3/3.1/',
            'https://1.aerial.maps.ls.hereapi.com/',
            'https://1.base.maps.ls.hereapi.com/',
            'https://download.vcdn.data.here.com/'
          ],
          'Access-Control-Allow-Origin': [
            'self',
            'get',
            'put',
            'data',
            'blob',
            'unsafe-inline',
            'https:',
            'https://download.vcdn.data.here.com/p/d/places2/icons/categories/'
          ]
          ,
          'script-src': [
              'self',
              'unsafe-inline',
              'data',
              'blob',
              'unsafe-eval',
              'https://cdnjs.cloudflare.com',
              'https://code.jquery.com',
              'https://cdn.jsdelivr.net',
              'https://stackpath.bootstrapcdn.com',
              'https://places.ls.hereapi.com',
              'https://unpkg.com',
              'https://cdnjs.cloudflare.com',
              'https://fonts.gstatic.com',
              'https://js.api.here.com/v3/3.1/',
              'https://vector.hereapi.com/',
              'https://1.aerial.maps.ls.hereapi.com/',
              'https://1.base.maps.ls.hereapi.com/',
              'https://download.vcdn.data.here.com/'
          ],
          'worker-src': [
              'self',
              'unsafe-inline',
              'data:',
              'blob:',
              'ws:',
              'https://cdnjs.cloudflare.com',
              'https://code.jquery.com',
              'https://cdn.jsdelivr.net',
              'https://stackpath.bootstrapcdn.com',
              'https://places.ls.hereapi.com',
              'https://unpkg.com',
              'https://cdnjs.cloudflare.com',
              'https://fonts.gstatic.com',
              'https://js.api.here.com/v3/3.1/',
              'https://vector.hereapi.com/',
              'https://1.aerial.maps.ls.hereapi.com/',
              'https://1.base.maps.ls.hereapi.com/',
              'https://download.vcdn.data.here.com/'
          ],
          'frame-src': [
              'self',
              'unsafe-inline',
              'data:',
              'blob:',
              'ws:',
              'https://cdnjs.cloudflare.com',
              'https://code.jquery.com',
              'https://cdn.jsdelivr.net',
              'https://stackpath.bootstrapcdn.com',
              'https://places.ls.hereapi.com',
              'https://unpkg.com',
              'https://cdnjs.cloudflare.com',
              'https://fonts.gstatic.com',
              'https://js.api.here.com/v3/3.1/',
              'https://vector.hereapi.com/',
              'https://1.aerial.maps.ls.hereapi.com/',
              'https://1.base.maps.ls.hereapi.com/',
              'https://download.vcdn.data.here.com/'
          ],
          'img-src': [
              'self',
              'unsafe-inline',
              'data:',
              'blob:',
              'ws:',
              'https://cdnjs.cloudflare.com',
              'https://code.jquery.com',
              'https://cdn.jsdelivr.net',
              'https://stackpath.bootstrapcdn.com',
              'https://places.ls.hereapi.com',
              'https://unpkg.com',
              'https://cdnjs.cloudflare.com',
              'https://fonts.gstatic.com',
              'https://js.api.here.com/v3/3.1/',
              'https://vector.hereapi.com/',
              'https://1.aerial.maps.ls.hereapi.com/',
              'https://1.base.maps.ls.hereapi.com/',
              'https://download.vcdn.data.here.com/'

          ],
          'connect-src': [
              'self',
              'unsafe-inline',
              'data:',
              'blob:',
              'ws:',
              'https://cdnjs.cloudflare.com',
              'https://code.jquery.com/',
              'https://cdn.jsdelivr.net',
              'https://stackpath.bootstrapcdn.com',
              'https://places.ls.hereapi.com',
              'https://unpkg.com',
              'https://cdnjs.cloudflare.com',
              'https://fonts.gstatic.com',
              'https://js.api.here.com/v3/3.1/',
              'https://vector.hereapi.com/',
              'https://1.aerial.maps.ls.hereapi.com/',
              'https://1.base.maps.ls.hereapi.com/',
              'https://download.vcdn.data.here.com/'
          ],
      },
  },
});



//console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinaynesta2002@gmail.com',
    pass: 'test@1234'
  }
});


// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);   // this api is a url.. it will be according to m broker url
  
  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  
  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());
  
  // Data sanitization against XSS
  app.use(xss());
  
  // Prevent parameter pollution



app.use('/',viewRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/userSWS',userSWSRouter);
app.use('/api/v1/ledger',ledgerRouter);
app.use('/api/v1/properties',propertyRouter);
app.use('/api/v1/rates',ratesRoutes);



app.post("/registrationSWS",userSWSController.registrationSWS);

app.post("/registrationn",propertyController.submitproperty);

app.post("/companyTransfer",propertyController.transferProperty);


app.post("/image", upload.single("myFile"), (req, res) => {
  console.log(req.file); // file information
  res.send("File uploaded successfully");
});

app.post('/submitMOM',userSWSController.submitmom);

app.post("/namesMatch",userSWSController.compareCompanyNames);

app.post("/match",userSWSController.compareCompanyNames);

app.post("/portfolio", async function (req, res) {
	console.log("ans",req.body);
    

    res.redirect("/account");
});

app.get("/portfolio", function(req, res){
	res.render("portfolio");
});

app.get("/namesResults",function(req, res){
  results=[{"name":"i"},{"name":"v"}];
  res.render("namesResults",results);
})



app.get('/pdf', async (req, res) => {
  try {
    
    const id = req.query.id;
    const pdf = await Pdf.findById(id);
    
    if (!pdf) {
      return res.status(404).send('PDF not found');
    }

    const pdf2jsonModule = await import('pdf2json');
    const pdf2json = new pdf2jsonModule.default();

    pdf2json.on('pdfParser_dataReady', data => {
      
      res.send(data["Meta"]);
    });

    pdf2json.parseBuffer(pdf.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get("/pdfs", async(req,res)=>{
  var pdfs = await mom.find({});
  
  res.render("momresults",{requesterDetails:pdfs});
})




app.get('/demo12', async (req, res) => {
      const urlToBuffer = async (url) => {
        return new Promise(async (resolve, reject) => {
            await jimp.read(url, async (err, image) => {
                if (err) {
                    console.log(`error reading image in jimp: ${err}`);
                    reject(err);
                }
                image.resize(400, 400);
                return image.getBuffer(jimp.MIME_PNG, (err, buffer) => {
                    if (err) {
                        console.log(`error converting image url to buffer: ${err}`);
                        reject(err);
                    }
                    resolve(buffer);
                });
            });
        });
      };

      const compareImage = async (
        twitterProfilePicURL,
        assetCDNURL
      ) => {
        try {
            console.log('> Started comparing two images');
            const img1Buffer = await urlToBuffer(twitterProfilePicURL);
            const img2Buffer = await urlToBuffer(assetCDNURL);
            const img1 = PNG.sync.read(img1Buffer);
            const img2 = PNG.sync.read(img2Buffer);
            const { width, height } = img1;
            const diff = new PNG({ width, height });
    
            const difference = pixelmatch(
                img1.data,
                img2.data,
                diff.data,
                width,
                height,
                {
                    threshold: 0.1,
                }
            );
  
          const compatibility = 100 - (difference * 100) / (width * height);
          console.log(`${difference} pixels differences`);
          console.log(`Compatibility: ${compatibility}%`);
          console.log('< Completed comparing two images');
          return compatibility;
      } catch (error) {
          console.log(`error comparing images: ${error}`);
          throw error;
      }
  };
  
  
  const result = compareImage('https://github.com/mapbox/pixelmatch/blob/HEAD/test/fixtures/4b.png?raw=true',
      'https://github.com/mapbox/pixelmatch/blob/HEAD/test/fixtures/6diff.png?raw=true'
  );
  res.send(result);

 
});

app.post("/stamp", async(req,res)=>{
  let data1 = {};

  const scriptPath = "C:/Users/vinay/Desktop/vinay/single-window-system-major/check.py";
  const scriptArgs = ['vinay', 'bhargii', 'pranay'];
  scriptArgs.push(req.body.text);

  const python = spawn('python', [scriptPath, ...scriptArgs]);

  python.stdout.on('data', (chunk) => {
    console.log(`stdout: ${chunk}`);
    console.log("typ of", typeof chunk);
    console.log("data",data1);
    res.write(chunk);
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  res.write(data1);
});

app.get("/conf",async(req,res)=>{
  const img1 = cv.imread('./public/test/test105.jpg');
  const img2 = cv.imread('./public/test/original.jpg');
  
  const sift = cv.SIFT_create();
  const keyPoints1 = sift.detect(img1);
  const keyPoints2 = sift.detect(img2);
  const descriptors1 = cv.compute(img1, keyPoints1);
  const descriptors2 = cv.compute(img2, keyPoints2);
  const matches = cv.matchFlannBased(descriptors1, descriptors2);
  const matchedImg = cv.drawMatches(img1, keyPoints1, img2, keyPoints2, matches);
  res.send("done successfully");
});

app.get("/pdfss",async(req,res)=>{
  const id = req.query.id;
  const pdfss = await Pdf.find({_id:id});
  
  
  const pdfssdata1 = pdfss[0];
  const json = JSON.stringify(pdfss);
  const slicedStr = json.slice(33,-3);
  res.send(pdfss);
  const buffer_data = pdfss[0].buffer.data;
  const pdfssdata = Buffer.from(buffer_data);
  
  PDFParser(pdfssdata, (err, data) => {
    if (err) throw err;
    res.send(data.text);
  });

  
});


app.get('/transactionn',async (req, res) => {
  const logs = await loginn.find({});
  id= logs[0].loginId;
  const taxes = await properties.find({user:id});
  res.render("transactionn",{taxDet:taxes});
});


var bodyParser = require('body-parser');
const catchAsync = require('./utils/catchAsync');
const mom = require('./models/momModel');
const { login } = require('./controllers/authController');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);


module.exports = app;

