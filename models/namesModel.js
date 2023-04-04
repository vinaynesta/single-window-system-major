const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const resultSchema = new mongoose.Schema({
    resultData : Array,
  });

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;