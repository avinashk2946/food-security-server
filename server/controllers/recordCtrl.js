var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var config = require('config');
var component = require("./../component");
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('recordCtrl');


exports.addRecord = function(req,res){
  try {
    new models.recordModel(req.body).save(function (err,data) {
      if(err){
        logger.error("addRecord ", err);
        return response.sendResponse(res,500,"error",constants.messages.error.saveRecord,err);
      }
      else {
        return response.sendResponse(res,200,"success",constants.messages.success.saveRecord,data);
      }
    })

  } catch (e) {

    logger.error("addRecord ", e);
  }
}


exports.getRecord = function(req,res){
  try {
    var params = {
      isDelete:false,
     //type:{$in:["aa","consultant","bm"]}
    };
    if(req.query._id){
      params['_id'] = req.query._id;
    }
    models.recordModel.find(params)
    .populate("plant supplier broker rawMaterial")
    .exec()
    .then(function(data){
      return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
    })
    .catch(function(err) {
        return response.sendResponse(res,500,"error",constants.messages.error.getData,err);
    })

  } catch (e) {
    logger.error("getRecord ", e);
  }
}


exports.getSearch = function(req, res) {
  try {
    var query = {};
    if(req.params.search == "false" || req.params.search == "true") {
      if(req.params.search == "false")
      req.params.search = false;

      if(req.params.search == "true")
      req.params.search = true;

      query["$or"] = [
         //give input as isApproved show as output that field which is related approved
         {approved  : req.params.search},
         // //give input as isNonGmo  show as output that field which is related nonGmo
         {nonGmo   :req.params.search},
      ]
    }
    else{
      query["$or"] = [
        //give input as country show as output that field which is related country
        {country : {
          $regex:req.params.search , $options: 'i' }
        },
        //give input as containerNo show as output that field which is related containerNo
        {containerNo : {
          $regex:req.params.search , $options: 'i' }
        },

        //give input as lotNo show as output that field which is related lotNo
        {lotNo  : {
          $regex:req.params.search , $options: 'i' }
        },
        //give input as po  show as output that field which is related po
       {po    : {
          $regex:req.params.search , $options: '' }
        },
        //give input as variety show as output that field which is related variety
        {variety  : {
          $regex:req.params.search , $options: 'i' }
        }

       ]
    }

    console.log("query  ",JSON.stringify(query))
    models.recordModel.find(query,function(err, data)
    {

                  if(err){
                    logger.error("getSearch ", err);
                    return response.sendResponse(res,500,"error",constants.messages.error.getData,err);
                  }
                  return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
     })
  } catch (e) {
    logger.error("getSearch " + error);

  }
}

/*
* Name : saveAttachments
* Info : this is used to save attachment , after multer uploaded file the server
*/
exports.saveAttachments = function(req,res) {
  var billOfLanding = [];
  var commercialInvoice = [];
  var packingList = [];
  var coa = [];
  var ccpVerification = [];
  var environmentalMonitoring = [];
  var otherSupporting = [];
  console.log("req.body._id   ",req.body._id);
  if(req.files.length) {
    for(var i in req.files) {
      console.log("******* ",req.files[i].fieldname.toLowerCase() ,String("billOfLanding").toLowerCase() , req.files[i].fieldname.toLowerCase().indexOf(String("billOfLanding").toLowerCase()) );
      if(req.files[i].fieldname.toLowerCase().indexOf(String("billOfLanding").toLowerCase())  != -1){
        console.log("Inside bill of landing  ");
        billOfLanding.push(req.files[i].path);
      }
      if(req.files[i].fieldname.toLowerCase().indexOf(String("commercialInvoice").toLowerCase())  != -1) {
        commercialInvoice.push(req.files[i].path);
      }
      if(req.files[i].fieldname.toLowerCase().indexOf(String("packingList").toLowerCase())  != -1){
        packingList.push(req.files[i].path);
      }
      if(req.files[i].fieldname.toLowerCase().indexOf(String("coa").toLowerCase())  != -1){
        coa.push(req.files[i].path);
      }
      if(req.files[i].fieldname.toLowerCase().indexOf(String("ccpVerification").toLowerCase())  != -1){
        ccpVerification.push(req.files[i].path);
      }
      if(req.files[i].fieldname.toLowerCase().indexOf(String("environmentalMonitoring").toLowerCase())  != -1){
        environmentalMonitoring.push(req.files[i].path);
      }
      if(req.files[i].fieldname.toLowerCase().indexOf(String("otherSupporting").toLowerCase())  != -1){
        otherSupporting.push(req.files[i].path);
      }
    }
  }

  // update record
  models.recordModel.update({_id:req.body._id},
    {
      billOfLanding:billOfLanding,
      commercialInvoice:commercialInvoice,
      packingList:packingList,
      coa:coa,
      ccpVerification:ccpVerification,
      environmentalMonitoring:environmentalMonitoring,
      otherSupporting:otherSupporting,
      isSetDocument: true // update flag for the document
    }  ,
    { multi:true} ,
    function(err,data) {
      if(err){
        return response.sendResponse(res, 500,"error",constants.messages.error.saveData,err);
      }
      else{
        return response.sendResponse(res,200,"success",constants.messages.success.saveData,data);
      }
    }
  )
}
exports.udpateRecord = function(req,res){
  try {
    var query = {
      "_id":req.body._id
    }
    delete req.body['_id'];
    var options = {new:true};
    models.recordModel.findOneAndUpdate(query, req.body,options).exec()
    .then(function(data) {
      return response.sendResponse(res,200,"success",constants.messages.success.udpateRecord,data);
    })
    .catch(function(err) {
      logger.error("updaterecord", err);
      return response.sendResponse(res, 500,"error",constants.messages.error.updateRecord,err);
    })

  } catch (e) {
    logger.error("updateRecord ", e);
  }
}

exports.deleteRecord = function(req, res) {
  try {
    var query = {
      "_id": {"$in":req.params.id.split(",")}
    }
    // delete req.body['_id'];
    console.log("query  ",query);
    models.recordModel.remove(query)
    .then(function(recordDeleted) {
      // deleted reocrd callback
      // deleting dependency sample preparation
      var query = {
        "record": {"$in":req.params.id.split(",")}
      }
      return models.samplePreparaionModel.remove(query);
      // return response.sendResponse(res, 200, "success", constants.messages.success.deleteData);
    })
    .then(function(sPreparationDelete){
      // deleting dependency sample collection
      var query = {
        "record": {"$in":req.params.id.split(",")}
      }
      return models.sampleCollectionModel.remove(query);
    })
    .then(function(sCollectionData) {
      return response.sendResponse(res, 200, "success", constants.messages.success.deleteData);
    })
    .catch(function(err) {
      logger.error("deleteRecord ", e);
      return response.sendResponse(res, 500, "error", constants.messages.error.deleteData, err);
    })

  } catch (e) {
    logger.error("deleteRecord ", e);
    return response.sendResponse(res, 500, "error", constants.messages.error.deleteData, err);
  }
}



/**
 * **************************************************************
 ******************  Sample preparation starts ******************
 * **************************************************************
 */
 exports.getSample = function(req,res){
   try {
     if(!req.params.recordId){
       return response.sendResponse(res, 401,"error",constants.messages.error.recordIdRequired);
     }
     models.sampleModel.find({record:req.params.recordId})
     .exec()
     .then(function(data) {
       return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
     })
     .catch(function(err) {
       return response.sendResponse(res,500,"error",constants.messages.error.getData,err);
     })

   } catch (e) {
     logger.error("updateRecord ", e);
   }
 }
 exports.saveSamplePreparaion = function(req,res){
   try {
     if(!req.body.record){
       return response.sendResponse(res, 401,"error",constants.messages.error.recordIdRequired);
     }
     var query = {
       record: req.body.record
     }
     var option = {
       new:true,
       upsert:true,
     }
     models.samplePreparaionModel.findOneAndUpdate(query,req.body,option)
     .then(function(data) {
       // response.sendResponse(res,200,"success",constants.messages.success.saveRecord);
       // update record tab for sample preparation completed
       var query = {_id:req.body.record};
       var update = {isSamplePreparation : true};
       var options = {multi:true};
       return models.recordModel.findOneAndUpdate(query,update,options).exec();

     })
     .then(function(data) {
       return response.sendResponse(res,200,"success",constants.messages.success.saveData);
     })
     .catch(function(err) {
       logger.error("updateRecord ", err);
       return response.sendResponse(res,500,"error",constants.messages.error.saveRecord,err);
     })

   } catch (err) {
     console.log("updateRecord ", err);
     logger.error("updateRecord ", err);
     return response.sendResponse(res,500,"error",constants.messages.error.saveRecord,err);
   }
 }
exports.getSamplePreparaion = function(req,res){
  if(!req.params.record){
    return response.sendResponse(res, 401,"error",constants.messages.error.recordIdRequired);
  }
  models.samplePreparaionModel.find({record:req.params.record}).exec()
  .then(function(data) {
    return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
  })
  .catch(function(err) {
    return response.sendResponse(res,500,"error",constants.messages.error.getData,err);
  })
}
exports.checkSupplierLot = function(req,res){
  // validation for :recordId: and :supplierLot
  var query = {
    supplier:req.params.supplier,
    lotNo:req.params.lotNo
  }
  models.recordModel.find(query).populate("rawMaterial").exec()
  .then(function(records) {
    var data = {
      newLot : true,
      po : "",
      pathogenTest:true,
      virusTest:true,
      pesticideTest:true,
    }
    for(var i in records){
      if(records[i].rawMaterial.rmGroupName == req.params.rmGroupName){
        if(data['newLot']) { // to execute one time only
          data['newLot'] = false;
          data['pathogenTest'] = records[i].rawMaterial.pathogenTest;
          data['virusTest'] = records[i].rawMaterial.virusTest;
          data['pesticideTest'] = records[i].rawMaterial.pesticideTest;
          data['po'] += records[i].po;
        }
        else{
          data['po'] += ","+records[i].po;
        }
      }
      if(!data['newLot']){
        data['po'] = data['po'].substr(0,data['po'].length-1) ; // remove lat ,
      }
    }
    return response.sendResponse(res, 200,"success",constants.messages.success.saveData,data);
  })
  .catch(function(err) {
    return response.sendResponse(res,500,"error",constants.messages.error.saveData,err);
  })


}



 /**
  * **************************************************************
  ******************  Sample preparation Ends ******************
  * **************************************************************
  */






 /**
  * **************************************************************
  ******************  Sample colection  starts ******************
  * **************************************************************
  */


  // used to save corresponding case image defined during sample preparation
  exports.saveSampleCollection2 = function(req,res){
    try{

      var selectedSamplePreparation ;
      var uploadPath = config.get(config.get("env")+".uploadPath")+"/sampleCollection";
      if(!req.body.record || !req.body.samplePreparation){
        return response.sendResponse(res, 401,"error",constants.messages.error.recordIdRequired);
      }
      var query = {
        _id : req.body.samplePreparation,
        record : req.body.record
      }
      models.samplePreparaionModel.findOne(query).exec()
      .then(function(samplePreparation) {
        if(!samplePreparation) {
          return response.sendResponse(res, 402,"error",constants.messages.error.dataNotFound);
        }
        selectedSamplePreparation = samplePreparation;
        // check if to add or update sample collection , sampleCollection == null -> create new record else update
        if(!req.body.sampleCollection){
          // remove if any sample collection present under this record and sample collection id
          // uplod case img
          // add new record
          models.sampleCollectionModel.remove({record : req.body.record},function(err,deletedSampleCollection) {
            if(err)
            {
              throw err;
            }
            component.utility.uploadImage({
              base64: req.body.base64,
              fileName: req.body.fileName
            },uploadPath, function(err, imagePath) {
              if (err) {
                logger.error("udpateUser  " + err);
                return response.sendResponse(res, 500,"error",constants.messages.error.imageUpload,err);
              }
              req.body.caseImg = imagePath;
              // creting new sample collection record
              var obj = {
                record : req.body.record,
                samplePreparation : req.body.samplePreparation,
                samples : [req.body] // here record,samplePreparation in body will be skipped as not mentioned in sample schema structure
              }
              new models.sampleCollectionModel(obj).save(function (err,data) {
                if(err) {
                  return response.sendResponse(res, 500,"error",constants.messages.error.saveData,err);
                }
                else{
                  return response.sendResponse(res, 200,"success",constants.messages.success.saveData,data);
                }
              })
            })
          })

        }
        else{
          // update to be done for sample collection
          models.sampleCollectionModel.findById(req.body.sampleCollection).exec()
          .then(function(sampleCollectionData) {
            if(!sampleCollectionData) {
              return response.sendResponse(res, 402,"error",constants.messages.error.dataNotFound+" sampleCollection");
            }
            var samplePlannedCount = getSampledPlannedByLot(req.body.supplierLot,selectedSamplePreparation)
            var presentSampleCount = getPresentSampleCount(req.body.supplierLot,sampleCollectionData);
            console.log("samplePlannedCount  ",samplePlannedCount);
            console.log("presentSampleCount  ",presentSampleCount);
            if(presentSampleCount < samplePlannedCount) {
              // update by insert sample
              component.utility.uploadImage({
                base64: req.body.base64,
                fileName: req.body.fileName
              },uploadPath, function(err, imagePath) {
                if (err) {
                  logger.error("udpateUser  " + err);
                  return response.sendResponse(res, 500,"error",constants.messages.error.imageUpload,err);
                }
                req.body.caseImg = imagePath;
                sampleCollectionData.samples.push(req.body);
                sampleCollectionData.save(function(err,data) {
                  if(err) {
                    throw err;
                  }
                  return response.sendResponse(res, 200,"success",constants.messages.success.updateData);
                })
              })
            }
            else{
              return response.sendResponse(res, 402,"error",constants.messages.error.sampleLimit);
            }
          })
          .catch(function(err) {
            throw err;
          })
        }
        // return response.sendResponse(res, 200,"success",samplePreparation);
      })
      .catch(function(err) {
          throw err;
      })

    }
    catch(err) {
      return response.sendResponse(res, 500,"error",constants.messages.error.getData,err);
    }

  }

  function getSampledPlannedByLot(supplierLot,selectedSamplePreparation){
    for(var i in selectedSamplePreparation.samples){
      if(selectedSamplePreparation.samples[i].supplierLot == supplierLot) {
        return selectedSamplePreparation.samples[i].quantityPlanned
      }
    }
    return 0; // for not found
  }
  function getPresentSampleCount(supplierLot,sampleCollection){
    var count = 0;
    for(var i in sampleCollection.samples){
      if(sampleCollection.samples[i].supplierLot == supplierLot) {
        count++;
      }
    }
    return count; // for not found
  }
  exports.saveSampleCollection = function(req,res){
    try {
      // validation goes here
      if(!req.body.record || !req.body.samplePreparation){
        return response.sendResponse(res, 401,"error",constants.messages.error.recordIdRequired);
      }
      var query = {
        record: req.body.record
      }
      var option = {
        new:true,
        upsert:true,
      }
      models.sampleCollectionModel.findOneAndUpdate(query,req.body,option)
      .then(function(data) {
         return response.sendResponse(res, 200,"success",constants.messages.success.saveData);
      })
      .catch(function(err) {
        console.log("updateRecord ", err);
        logger.error("updateRecord ", err);
        return response.sendResponse(res, 500,"error",constants.messages.error.saveData);
      })

    } catch (err) {
      console.log("updateRecord ", err);
      logger.error("updateRecord ", err);
      return response.sendResponse(res,500,"error",constants.messages.error.saveData,err);
    }
  }
  exports.uploadSampleCollection = function(req,res){
    try {
      // validation goes here
      if(!req.body._id){ //
        return response.sendResponse(res, 401,"error",constants.messages.error.sampleCollectionIdRequired);
      }
      models.sampleCollectionModel.findById(req.body._id).exec()
      .then(function(sampleCollection) {
        if(!sampleCollection) {
          return response.sendResponse(res, 402,"error",constants.messages.error.dataNotFound);
        }
        // updating samples image path by looping in file from req and samples array mathcing lot
        for(var i in req.files) {
          for(var j in sampleCollection.samples){
            if(sampleCollection.samples[j].supplierLot
              && sampleCollection.samples[j].supplierLot.toLowerCase() == req.files[i].fieldname.split("_")[0].toLowerCase()
              && sampleCollection.samples[j].index == req.files[i].fieldname.split("_")[1]
            ){
              sampleCollection.samples[j].caseImg = req.files[i].path;
            }
          }
        }
        sampleCollection.save(function(err,data) {
          if(err){
            return response.sendResponse(res, 500,"error","error in upload image data",err);
          }
          else{
            return response.sendResponse(res, 200,"success",constants.messages.success.saveData,sampleCollection._id);
          }
        });
        //return response.sendResponse(res, 200,"success",constants.messages.success.saveData,sampleCollection._id);
      })
      .catch(function(err) {
        return response.sendResponse(res, 500,"error",constants.messages.error.saveData,err);
      })

    } catch (err) {
      console.log("updateRecord ", err);
      logger.error("updateRecord ", err);
      return response.sendResponse(res,500,"error",constants.messages.error.saveData,err);
    }
  }
  exports.getSampleCollection = function(req,res){
    if(!req.params.record){
      return response.sendResponse(res, 401,"error",constants.messages.error.recordIdRequired);
    }
    models.sampleCollectionModel.find({record:req.params.record}).exec()
    .then(function(data) {
      return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
    })
    .catch(function(err) {
      return response.sendResponse(res,500,"error",constants.messages.error.getData,err);
    })
  }
 /**
  * **************************************************************
  ******************  Sample colection  starts ******************
  * **************************************************************
  */
