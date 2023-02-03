const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    aadharId:{
      type:Number,
      required:true,
      unique:true,
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please tell us your date of birth!']
      },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    mobileNumber: {
      type:Number,
      required: [true, 'Please provide your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    privateKey: {
        type: String,
    },
    status:{
      type:Number,
      default:-1
    },
    transactions:[
      {
        propertyId:mongoose.Schema.ObjectId,
      }
    ],
    toPay:[
      {
        propertyId:mongoose.Schema.ObjectId,
        amount:Number,
      }
    ],
    state:String,
    district:String,
    mandal:String,
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    timeStamp: {
      type: Date,
      default:Date.now(),
      select: false
    },
    photo: {
      type:String,
      default: 'default.jpg'
    },
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],  // can accept only these fields
      default: 'user'
    },
    assets:[
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
      }
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
  });

  userSchema.pre('save', async function (next) {   // it has to be function (next)
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });




  // for private key
  userSchema.pre('save', async function (next) {   // it has to be function (next)
    // Only run this function if password was actually modified
    const d = new Date();
    let s1=this.mobileNumber + d;
    // Hash the password with cost of 12
    this.privateKey = await bcrypt.hash(s1, 12);

    next();
  });


  userSchema.pre('find', function(next){
    //console.log("hiiii");
    this.populate({
      path:'assets',
      //select:'zoneId natureOfUsage occupancy'
    })
    
  this.find({active:{$ne:false}});
  next();
  });

  userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
  });



  userSchema.methods.changePasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){    // we need to modify the date to jwtimestap
      const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)

      //console.log(changedTimeStamp,JWTTimestamp);
      return JWTTimestamp < changedTimeStamp; 
      // token was issued at time 100 and password was changed aat time 200, i.e returns true i.e password changed
    }
     // false not changed
    return false;
  }

  userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
  };

  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    //console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };


  const User = mongoose.model('User', userSchema);

  module.exports = User;