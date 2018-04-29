var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var clientSchema = new mongoose.Schema({
    name              : {type: String,unique:true,trim:true},
    contactName              : {type: String},
    email              : {type: String},
    street              : {type: String},
    city              : {type: String},
    district              : {type: String},
    state              : {type: String},
    country              : {type: String},
    pin              : {type: String},
    fax              : {type: String},
    phone              : {type: String},
    mobile              : {type: String},

    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
clientSchema.plugin(uniqueValidator, {message: constants.messages.error.clientExist});
var clientModel = mongoose.model('client', clientSchema);
module.exports = clientModel;
