var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var brokerSchema = new mongoose.Schema({
 client                : {type: Schema.Types.ObjectId, ref: 'client',default:null},
  suppliers                       : [{type: Schema.Types.ObjectId, ref: 'supplier'}],
  name                             : {type:String,required:true},
  address : [
    {
      city              : {type: String},
      region            : {type: String},
      state             : {type: String},
      pin               : {type: String},
      country           :{type: String}
    }
  ],
  isDelete          : {type: Boolean, default:false},
  createdDate       :{type: Date, default:new Date()},
});
// brokerSchema.plugin(uniqueValidator, {message: constants.messages.error.roleExist});
var brokerModel = mongoose.model('broker', brokerSchema);
module.exports = brokerModel;
