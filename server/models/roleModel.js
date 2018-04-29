var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var roleSchema = new mongoose.Schema({
  client                : {type: Schema.Types.ObjectId, ref: 'client',default:null},
    type              : {type: String,unique:true,trim:true},
    menu              : [Schema.Types.Mixed],
    api               : [Schema.Types.Mixed],
    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
roleSchema.plugin(uniqueValidator, {message: constants.messages.error.roleExist});
var roleModel = mongoose.model('role', roleSchema);
module.exports = roleModel;
