const mongoose = require('mongoose');

const interestRatesSchema = new mongoose.Schema({
    zoneId:{
        type:String,
        required:true
    },
    huts:{
        type: Number,
        required:true
    },
    jackArch:{
        type: Number,
        required:true
    },
    slates:{
        type: Number,
        required:true
    },
    rcc:{
        type: Number,
        required:true
    },
    rccHighRise:{
        type: Number,
        required:true
    },
    accSheetEx:{
        type: Number,
        required:true
    },
    accSheet:{
        type: Number,
        required:true
    },
    madrasTerrace:{
        type:Number,
        required:true
    },
    countryTiled:{
        type:Number,
        required:true
    },
    giSheet:{
        type:Number,
        required:true
    },

    commercial:{
        type: Number,
        required:true
    },
    owner:{
        type: Number,
        required:true
    },
    tenant:{
        type: Number,
        required:true
    },
    cellar:{
        type: Number,
        required:true
    },
    mezzanine:{
            type: Number,
            required:true
        },
    parking:{
            type: Number,
            required:true
        },
    basement2:{
            type: Number,
            required:true
        },
    basement1:{
            type: Number,
            required:true
       },
    slitFloor:{
            type: Number,
            required:true
        },
    groundFloor:{
            type: Number,
            required:true
        },
    floor1:{
            type: Number,
            required:true
        },
    floor2:{
            type: Number,
            required:true
        },

    floor3:{
            type: Number,
            required:true
        },

    floor4:{
            type: Number,
            required:true
        },

    floor5:{
            type: Number,
            required:true
        },
    floor6:{
            type: Number,
            required:true
        },

    floor7:{
            type: Number,
            required:true
        },

    floor8:{
            type: Number,
            required:true
        },

    floor9:{
            type: Number,
            required:true
        },

    floor10:{
            type: Number,
            required:true
        },
    floor11:{
            type: Number,
            required:true
        },
    floor12:{
            type: Number,
            required:true
        },
    floor13:{
            type: Number,
            required:true
        },
    floor14:{
            type: Number,
            required:true
        },
    floor15:{
            type: Number,
            required:true
        },
        residence:{
            type: Number,
            required:true
        },
        shops:{
            type: Number,
            required:true
        },
        officeComplex:{
            type: Number,
            required:true
        },
        hospitals:{
            type: Number,
            required:true
        },
        educationalInstitutions:{
            type: Number,
            required:true
        },
        godownsOtherBusiness:{
            type: Number,
            required:true
        },
        industries:{
            type: Number,
            required:true
        },
        cinemaTheaters:{
            type: Number,
            required:true
        },
        others:{
            type: Number,
            required:true
        },
        shopsOnMainroad:{
            type: Number,
            required:true
        },
        atms:{
            type: Number,
            required:true
        },
        hotels:{
            type: Number,
            required:true
        },
        restaurants:{
            type: Number,
            required:true
        },
        lodges:{
            type: Number,
            required:true
        },
        banks:{
            type: Number,
            required:true
        },
        cellTowers:{
            type: Number,
            required:true
        },
        nursingHours:{
            type: Number,
            required:true
        }
    
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);


const interestRates = mongoose.model('interestRates', interestRatesSchema);

module.exports = interestRates; 

  