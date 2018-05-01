4/**
 * Composite key for raw materials to be created from mongo console
 * with supplier id and country
 */

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var rawMatrialSchema = new mongoose.Schema({
    client                : {type: Schema.Types.ObjectId, ref: 'client',default:null},
    plant                   :{type: Schema.Types.ObjectId, ref: 'plant'},
    supplier                :{type: Schema.Types.ObjectId, ref: 'supplier',required:true},
    broker                  :{type: Schema.Types.ObjectId, ref: 'broker'},
    rmGroupName		        	:{type: String , required:true},
    name                    : {type: String , required:true},
    rmCode                  : {type: String , required:true},
    format                  : {type: String , required:true},
    variety                 : [{type: String}],
    country                 : {type: String, required:true}, // required, this should match with country of supplier
    isApproved              : {type: Boolean,default:false},
    kosher                  : {type:Boolean,default:false},
    organic                 : {type:Boolean,default:false},
    nonGmo                  : {type:Boolean,default:false},
    certification           : {type: Boolean,default:false},
    samplingMethod          : {type: Boolean,default:false},
    pathogenTest            : {type: Boolean,default:false},
    virusTest               : {type: Boolean,default:false},
    pesticideTest           : {type: Boolean,default:false},

    createdDate            : {type: Date, default: new Date()},
    isDelete               : {type: Boolean, default:false},
});
// rawMatrialSchema.plugin(uniqueValidator, {message: constants.messages.error.roleExist});
var rawMatrialModel = mongoose.model('rawMaterial', rawMatrialSchema);
module.exports = rawMatrialModel;
