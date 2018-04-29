var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var password = require('password-hash-and-salt');
var userSchema = new mongoose.Schema({
  client                : {type: Schema.Types.ObjectId, ref: 'client',default:null},
    role                : {type: Schema.Types.ObjectId, ref: 'role',required: true},
    client              : {type: String, default:null},
    plant               : {type: Schema.Types.ObjectId, ref: 'plant',required: constants.messages.error.undefinedPlantId},
    username            : {type: String,unique : true,required: constants.messages.error.undefinedUsername},
    password            : {type: String,required: constants.messages.error.undefinedPassword},
    email               : {type: String,unique : true,required: constants.messages.error.undefinedEmail},
    salutation          : {type: String, required :  constants.messages.error.undefinedSalutation},
    firstName           : {type: String, required :  constants.messages.error.undefinedFirstName},
    lastName            : {type: String, required :  constants.messages.error.undefinedSalutation},
    empId               : {type: String, default:"NA"},
    phone               : {type: String, default:"NA"},


    // address
    country          :  {type: String, default:"NA"},
    state          :  {type: String, default:"NA"},
    city          :  {type: String, default:"NA"},
    pin          :  {type: String, default:"NA"},

    resetPasswordToken: {type: String, default:"null"},
    isDelete          : {type: Boolean, default:false},
});
userSchema.plugin(uniqueValidator, {message: "User Already Exist !"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
