var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
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
    .populate("plant supplier rawMaterial")
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
      "_id": req.params.id
    }
    delete req.body['_id'];
    models.recordModel.findOneAndUpdate(query, {
      "isDelete": true
    }, {
      "new": true
    }, function(err, data) {
      if (err) {
        logger.error("deleteRecord ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.deleteData, err);
      } else
        return response.sendResponse(res, 200, "success", constants.messages.success.deleteData);
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
     new models.samplePreparaionModel(req.body).save()
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
  exports.saveSampleCollection = function(req,res){
    try {
      // validation goes here
      if(!req.body.record || !req.body.samplePreparation){
        return response.sendResponse(res, 401,"error",constants.messages.error.recordIdRequired);
      }

      new models.sampleCollectionModel(req.body).save()
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
      // new models.sampleCollectionModel(req.body).save()
      // .then(function(data) {
      //    return response.sendResponse(res, 200,"success",constants.messages.success.saveData);
      // })
      // .catch(function(err) {
      //   console.log("updateRecord ", err);
      //   logger.error("updateRecord ", err);
      //   return response.sendResponse(res, 500,"error",constants.messages.error.saveData);
      // })

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
