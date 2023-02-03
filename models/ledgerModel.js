
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const ledgerSchema = new Schema({
    previousHashValue: {
      type: String,
    },
    senderPublicAddress: {
        type: String,
      },
    receiverPublicAddress: {
        type: String,
        default: "6307530597c871b934c42978"
      },
    amount: {
        type: Number,
      },
    hashValue: {
        type: String,
      },
    magicNumber: {
        type: String,
      },
      createdAt: {
        type:Date,
        default:Date.now(),  
     },
  },
  {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
  });
  
  module.exports = mongoose.models.Ledger || mongoose.model('Ledger', ledgerSchema);
  