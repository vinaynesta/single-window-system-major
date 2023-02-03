const crypto = require('crypto');
const {promisify} = require('util');
const User = require('./../models/userModel');
const UserSWS = require('./../models/userSWSModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE_IN});
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;    
    user.passwordChangedAt = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };


exports.signup = catchAsync(async (req, res, next) => {
      const newUser = await User.create(req.body);
      createSendToken(newUser, 201, res);
     });

exports.signupSWS = catchAsync(async (req, res, next) => {
      const newUser = await UserSWS.create(req.body);
      createSendToken(newUserSWS, 221, res);
     });

exports.login = catchAsync(async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    
    if(!email || !password){
        //console.log(email);
        //console.log(password);
        return next(new AppError('please provide email and password!',400));
    }
    const user= await User.findOne({email:email}).select('+password');
    

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('incorrect username or password',401));
    }
    //console.log(user);


    createSendToken(user, 200, res);   
    
});

exports.protect = catchAsync(async (req,res,next)=>{
  
    // 1) getting token and check if there is a token in the url
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt){
      token = req.cookies.jwt;
    }
    if(!token){
        return next(new AppError('You are not Logged in! Please login',401))
    };

    // 2) verify the token

    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    //console.log(decoded);


    //  3) check if user still exists
    // again goes through the db to check if the user id is available
    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('the user belonging to this token does not exist',401));
    }

    //  4) check if user changed the password after token was issued
    if(freshUser.changePasswordAfter(decoded.iat)){  // issued at
        return next(new AppError('the user changed password! Please login again',401));
    }

    // grant access to protechted route

    req.user = freshUser;  // user is random variable
    res.locals.user = freshUser;
    next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //console.log(decoded);
      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changePasswordAfter(decoded.iat)) {  
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;  // here user is a random varaible

      
    } 
    catch (err) {
      return next();
    }
  }
  next();
};

exports.logOut = (req,res)=>{
  res.cookie('jwt','loggedOut',{
    expires: new Date(Date.now()+5*1000),
    httpOnly:true
  });
  res.status(200).json({
    status:'success',
  });
};

exports.restrictTo = (...roles) =>{
    return (req,res,next) => {
        // roles is an array of argument or parameters like admin,lead-guide
           // in exports we have access to all variables within the file
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to access perform this action',403));
        }

        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
  
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(new AppError('There was an error sending the email. Try again later!'),500);
    }
  });

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }
  
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
  
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});

exports.verifyLogin = catchAsync(async(req,res,next)=>{
  const password = req.body.password;
  const email = req.user.email
  
  
  if(!password){
      return next(new AppError('please provide password!',400));
  }
  const user= await User.findOne({email:email}).select('+password');
  

  if(!user || !(await user.correctPassword(password,user.password))){
      return next(new AppError('incorrect username or password',401));
  }
  res.status(201).json({
    status: 'success',
  });
  next()
});