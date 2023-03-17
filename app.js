const express = require('express');
const path = require('path');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const userRouter = require('./routes/userRoutes');
const userSWSRouter = require('./routes/userSWSRoutes');
const viewRouter = require('./routes/viewRoutes');
const ledgerRouter = require("./routes/ledgerRoutes")
const propertyRouter = require("./routes/propertyRoutes")
const ratesRoutes = require('./routes/ratesRoutes')
const userSWSController = require('./controllers/userSWSController');

const csp = require('express-csp');

const app = express();

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));  

app.use(express.static(path.join(__dirname,'/public/')));

// Set security HTTP headers
app.use(helmet());

//compression
app.use(compression());

// pdf uploading packages
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

//body and json parsing in express
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();


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

//app.post('/registrationSWS',userSWSController.registrationSWS);
// app.post("/registrationSWS", async function (req, res) {
// 	console.log("requesttttt",req.body);
// });

//app.post("/registrationSWS",userSWSController.registrationSWS);

app.post("/portfolio", async function (req, res) {
	console.log("ans",req.body);
    /*const port = new portfolio({
    idea: req.body.idea,
    ask: req.body.ask,
    equity: req.body.equity,
    evaluation: req.body.ask/req.body.equity,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    demoVideoLink: req.body.demoVideoLink
     });
    console.log(port);
    
    port.save();
 
    uid = req.body.email;
    console.log("email",uid);

    let pid =port._id;
    console.log("pid",pid);
    await Users.findOneAndUpdate(
        { email: uid, },
        { $push: { ideas: pid, } ,}
     );*/

    res.redirect("/account");
});

app.get("/portfolio", function(req, res){
	res.render("portfolio");
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
  
app.use(globalErrorHandler);  


module.exports = app;

