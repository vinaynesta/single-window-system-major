const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
const userSWSController = require('./../controllers/userSWSController');

const router = express.Router();
  

router.get('/orders',authController.isLoggedIn,authController.protect,viewsController.orders);
router.get('/ledger',viewsController.ledgerr);


router.get('/',authController.isLoggedIn,viewsController.getIndex);
router.get('/login',authController.isLoggedIn,viewsController.getLoginForm);
router.get('/signup',authController.isLoggedIn,viewsController.getSignUpForm);

router.get('/account',authController.isLoggedIn,authController.protect,viewsController.getAccount);
router.get('/profile',authController.isLoggedIn,authController.protect,viewsController.getProfile);
router.get('/payment',authController.isLoggedIn,authController.protect,viewsController.getPayment);
router.get('/assets',authController.isLoggedIn,authController.protect,viewsController.assets);
router.get('/propertytransfer',authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),viewsController.propertyTransfer);
router.get('/registrationSWS',authController.isLoggedIn,authController.protect,viewsController.registrationSWS);
router.get('/companyTransfer',authController.isLoggedIn,authController.protect,viewsController.companyTransfer);
router.get('/namesMatch',authController.isLoggedIn,authController.protect,viewsController.namesMatch);
router.get('/registration',authController.isLoggedIn,authController.protect,viewsController.registration);
router.get('/namesResults',authController.isLoggedIn,authController.protect,viewsController.namesResults);
router.get('/moaaoa',authController.isLoggedIn,authController.protect,viewsController.moaaoa);
router.get('/upload',authController.isLoggedIn,authController.protect,viewsController.upload);
router.get('/uploadmom',authController.isLoggedIn,authController.protect,viewsController.uploadmom);
router.get('/momresults',authController.isLoggedIn,authController.protect,viewsController.momresults);
router.get('/zonedetails',authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),viewsController.zonedetails);
router.get('/features',authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),viewsController.features);
router.get('/verification',authController.isLoggedIn,authController.protect,viewsController.privatekey);
router.get('/transaction',authController.isLoggedIn,authController.protect,viewsController.transaction);
router.get('/invoice',authController.isLoggedIn,authController.protect,viewsController.invoice);
router.get('/paid',authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),viewsController.paid);
router.get('/unpaid',authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),viewsController.unpaid);
router.get('/details',authController.isLoggedIn,authController.protect,authController.restrictTo('admin'),viewsController.details);


module.exports = router;  
