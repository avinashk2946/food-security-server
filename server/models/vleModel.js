var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var password = require('password-hash-and-salt');
var models = require("./index");

var vleSchema = new mongoose.Schema({
    role                : {type: Schema.Types.ObjectId, ref: 'role',required: true},
    name                :{type: String},
    mobile              : {type: String},
    altMobile           : {type: String},
    email               :{type: String},
    digiMail            :{type: String},
    cscId               :{type: String},
    religion            :{type: String},
    state               :{type: Schema.Types.ObjectId,default:"Odisha"},
    district            :{type: Schema.Types.ObjectId, ref: 'district',default:null},
   block                :{type: Schema.Types.ObjectId, ref: 'block',default:null},
   gp                 :{type: String,ref: 'gp',default:null},
    village             :{type: String},
     urban              :{type: Boolean,default:false},
    urbanType           :{type: String},
     ward               :{type: String},
      dob                 : {type: String},
     gender             :{type: String},
     caste              :{type: String},
    pan                 : {type: String},
    adhar               : {type: String},
    plotNo              : {type: String},
    lane                : {type: String},
    at                  : {type: String},
    po                  : {type: String},
    city                : {type: String},
    dist                : {type: String},
    state               : {type: String},
    country             : {type: String},
    pin                 : {type: String},
    //educational details
    matricBoard         : {type: String},
    matricInstitute     : {type: String},
    matricPassout       : {type: String},
    matricPercent       : {type: String},
    interBoard          : {type: String},
    interInstitute      : {type: String},
    interPassout        : {type: String},
    interPercent        : {type: String},
    gradBoard           : {type: String},
    gradInstitute       : {type: String},
    gradPassout         : {type: String},
    gradPercent         : {type: String},
    pgBoard             : {type: String},
    pgInstitute         : {type: String},
    pgPassout           : {type: String},
    pgPercent           : {type: String},
    otherQualification  : {type: String},
    //csc details
    cscBuildingArea     : {type: String},
    personEngaged       : {type: String},
    webCamera           : {type: String},
    furnitureDetails    : {type: String},
    vsatBbDcNofn        : {type: String},
    pmgDishaId          : {type: String},
    kit                 : {type: String},
    providingInsurance  : {type: String},
    eWallet             : {type: String},
    censusCode          : {type: String},
    cscLattitude        : {type: String},
    buildingOwnership   : {type: String},
    noOfLaptop          : {type: String},
    noOfPrinters        : {type: String},
    bioMetric           : {type: String},
    commonBranding      : {type: String},
    powerBackUp         : {type: String},
    tab                 : {type: String},
    ProvidingEDistrictServices  : {type: String},
    cscLocation         : {type: String},
    ownership   : {type: String},
    cscLongitude        : {type: String},
    cscPin              : {type: String},


    // status
    status            : {type: String,enum: constants.userStatus,default:'pending'},
    isDelete          : {type: Boolean, default:false},
});

// pre save
// vleSchema.methods.preSave = function(cb){
//   console.log('pre save ',this.body);
// }

vleSchema.pre('save',function(next){
  var update = {
    isCover:true
  },
  option = {
    new : true
  },
  districtQuery = {
    _id:this.district
  },
  blockQuery = {
    _id:this.block
  },
  gpQuery = {
    _id:this.gp
  };
  models.districtModel.update(districtQuery,update,option,function(err,district){
    if(err){
      next(err);
    }
    else{
      models.blockModel.update(blockQuery,update,option,function(err,block){
        if(err){
          next(err);
        }
        else{
          models.gpModel.update(gpQuery,update,option,function(err,gp){
            if(err){
              next(err);
            }
            else{
              next();
            }
          })
        }
      })
    }
  })
  // next();
})
vleSchema.plugin(uniqueValidator, {message: "Email / Mobile already exists"});

var vleModel = mongoose.model('vle', vleSchema);

module.exports = vleModel;
