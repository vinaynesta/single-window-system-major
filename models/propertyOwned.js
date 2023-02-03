const mongoose = require('mongoose');
const Rates = require("./interestRates")

const propertyOwnedSchema = new mongoose.Schema({
    zoneId:{
        type: String,
        required:true,
        lowercase: true
    },
    baseValue:{
        type:Number,
        required:true,
    },
    buildingClassification:{
        type:String,
        required:true,
        lowercase: true
    },
    floorNo:{
        type:String,
        required:true,
        lowercase: true
    },
    occupancy:{
        type:String,
        required:true,
        lowercase: true
    },
    area:{
        type:Number,
        required:true,

    },
    constructionDate:{
        type:Date,
        default:Date.now(), 
    },
    natureOfUsage:{
        type:String,
        required:true,
        lowercase: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    tax:{
        type:Number,
        default: 0
    },
    status:{
        type:Number,
        default:-1
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

propertyOwnedSchema.pre(/^find/,async function(next){
    let base = this.base
    let area = this.area
    let doc = await Rates.find({zoneId:this.zoneId}) 

  next();
  });


const propertyOwned = mongoose.model('Property', propertyOwnedSchema);



module.exports = propertyOwned; 


