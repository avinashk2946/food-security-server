var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var sampleCollectionSchema = new mongoose.Schema({
    record              : {type: Schema.Types.ObjectId,required:true, ref: 'record'},
    samplePreparation   : {type: Schema.Types.ObjectId,required:true, ref: 'samplePreparation'}, // will be used for validation with samplePreparation
    samples : [
      {
        // index               :{type:Number}, // need to remove later on if not neccessary
        supplierLot         :{type:String,required:true},
        caseImg              :{type:String,default:""},
        qualityAnalysis      : {type:Boolean,default:false},
        // microTest      : {type:Boolean,default:false},
        // virusTest      : {type:Boolean,default:false},
        // indicatorTest      : {type:Boolean,default:false},
        testGrp           : {type:Boolean,default:false},
        pesticideTest      : {type:Boolean,default:false},
        comment          :{type:String},
      }
    ],
    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
var sampleCollectionModel = mongoose.model('sampleCollection', sampleCollectionSchema);
module.exports = sampleCollectionModel;
