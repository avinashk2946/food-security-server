var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var supplierSchema = new mongoose.Schema({
  plants           : [{type: Schema.Types.ObjectId, ref: 'plant'}],
  name              :{type: String,required:true},
  id                :  {type: String,required:true,unique:true},
  phone             :{type: String},
  address : [
    {
      city              : {type: String},
      region            : {type: String},
      state             : {type: String},
      pin               : {type: String},
      country           :{type: String}
    }
  ],

  // point of contact details
  contactSalutation : {type: String,required:true},
  contactFirstName  : {type: String,required:true},
  contactLastName   : {type: String},
  contactPosition   : {type: String},
  contactEmail      : {type: String},
  contact24Hour     :  {type: String},
  // Logistic details
  logisticFirstName : {type: String},
  logisticLastName  : {type: String},
  logisticTitle     : {type: String},
  logisticEmail     : {type: String},
  logisticPhone     :  {type: String},

  // QA details
  qaFirstName       : {type: String},
  qaLastName        : {type: String},
  qaTitle           : {type: String},
  qaEmail           : {type: String},
  qaPhone           : {type: String},

  // customer details
  csFirstName       : {type: String},
  csLastName        : {type: String},
  csTitle           : {type: String},
  csEmail           : {type: String},
  csPhone           : {type: String},
  supplierNote      : {type: String},

  createdDate       : {type: Date, default: new Date()},
  isDelete          : {type: Boolean, default:false},
});
supplierSchema.plugin(uniqueValidator, {message: constants.messages.error.supplierExist});
var supplierModel = mongoose.model('supplier', supplierSchema);
module.exports = supplierModel;
