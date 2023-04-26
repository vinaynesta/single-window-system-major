const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Schema } = mongoose;

const loginSchema = new mongoose.Schema({
    loginId : String,
  });

const login = mongoose.model('login', loginSchema);

module.exports = login;