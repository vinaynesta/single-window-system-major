const mongoose = require('mongoose');

const UserSWSSchema = new mongoose.Schema({
    userNameSWS: {
      type: String,
    },
    age: {
        type: Number,
      },
    mobileNumber: {
        type: String,
      },
    favColor: {
        type: String,
      },
    occupancy: {
        type: String,
      },
  
  },
  {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
  });


  const UserSWS = mongoose.model('UserSWS', UserSWSSchema);

  module.exports = UserSWS; 