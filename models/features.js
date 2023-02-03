const mongoose = require('mongoose');

const featuresSchema= new mongoose.Schema({
    state:{
        type: String,
        unique:true,
        required:true,
        lowercase: true
    },
    baseValue:{
        type:Number,
        required:true,
    },
    values1:{
        type:String,
    },
    values2:{
        type:String,
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);


const featureSchema = mongoose.model('features', featuresSchema);

module.exports = propertyOwned; 


