const mongoose = require('mongoose');

const momSchema = new mongoose.Schema({
    sector: {
      type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    state: {
        type: String,
      },
    objective: {
        type: String,
      },
    liability: {
        type: Number,
      },
    capital: {
        type: Number,
      },
    status: {
        type: String,
    },

  
  },
  {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
  });


  const mom = mongoose.model('mom', momSchema);

  module.exports = mom; 