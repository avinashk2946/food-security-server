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
var waterfall = require('async-waterfall');

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
  var searches = req.params.search.split(",");
  var count = 0;
  var resultArr = [];
  var intersectionArr = [];
  var err;
  recurssiveSearch(searches,count,resultArr,err,function(err,resultArr) {
    if(err){
      return response.sendResponse(res, 500,"error",constants.messages.error.saveData,err);
    }
    else{
      //return response.sendResponse(res,200,"success",constants.messages.success.saveData,resultArr);
      if(resultArr.length == 1){
        return response.sendResponse(res,200,"success",constants.messages.success.saveData,resultArr[0]);
      }
      // make intersection of result arr
      for(var i = 0 ; i < resultArr.length - 1 ; i++) {
        var array1 = resultArr[i];
        var array2 = resultArr[i+1];
        var result = array1.filter(function(n1) {
          return !(array2.some(function(n2){
            return n1._id.toString() == n2._id.toString();
          }))
        });
        intersectionArr = intersectionArr.concat(result);
      }
      return response.sendResponse(res,200,"success",constants.messages.success.saveData,intersectionArr);
    }
  });


}
var recurssiveSearch = function(searches,count,resultArr,err,callback) {
  console.log("resultArr start - length   -  "+resultArr.length);
  if(!searches[count])
  {
    return callback(err,resultArr);// close recurrsion

  }
  var search = searches[count];
  try{
    var query = {};
    waterfall([
      function(callback){
        // get related plant ids start
        query["$or"] = [
          //give input as country show as output that field which is related country
          {plantId : {
            $regex:search , $options: 'i' }
          },
          {name : {
            $regex:search , $options: 'i' }
          },
          //give input as containerNo show as output that field which is related containerNo
          // {country : {
          //   $regex:search , $options: 'i' }
          // },

          //give input as lotNo show as output that field which is related lotNo
          {state  : {
            $regex:search , $options: 'i' }
          },
          //give input as po  show as output that field which is related po
          {city    : {
            $regex:search , $options: '' }
          },
          //give input as variety show as output that field which is related variety
          {pin  : {
            $regex:search , $options: 'i' }
          }

        ]
        models.plantModel.find(query).distinct("_id").exec()
        .then(function(plants) {
          callback(null, plants);
        }) // get related plant ids ends
        .catch(function(err) {
          logger.error(err);
          callback(err, plants);
        })
      },
      function(plants, callback){
        // get related supplier ids
        query["$or"] = [
          {name : {
            $regex:search , $options: 'i' }
          },
          {id : {
            $regex:search , $options: 'i' }
          },
          {phone : {
            $regex:search , $options: 'i' }
          },
          {"address.city" : {
            $regex:search , $options: 'i' }
          },
          {"address.region" : {
            $regex:search , $options: 'i' }
          },
          {"address.state" : {
            $regex:search , $options: 'i' }
          },
          {"address.pin" : {
            $regex:search , $options: 'i' }
          },
          {"address.country" : {
            $regex:search , $options: 'i' }
          },
          {"contactFirstName" : {
            $regex:search , $options: 'i' }
          },
          {"contactLastName" : {
            $regex:search , $options: 'i' }
          },
          {"contactPosition" : {
            $regex:search , $options: 'i' }
          },
          {"contactEmail" : {
            $regex:search , $options: 'i' }
          },
          {"contact24Hour" : {
            $regex:search , $options: 'i' }
          },


        ]
        models.supplierModel.find(query).distinct("_id").exec()
        .then(function(suppliers) {
          callback(null, plants,suppliers);
        }) // get related plant ids ends
        .catch(function(err) {
          logger.error(err);
          callback(err, plants,suppliers);
        })
      },
      function(plants,suppliers, callback){
        // get related broker ids
        query["$or"] = [
          {name : {
            $regex:search , $options: 'i' }
          },
          {"address.city" : {
            $regex:search , $options: 'i' }
          },
          {"address.region" : {
            $regex:search , $options: 'i' }
          },
          {"address.state" : {
            $regex:search , $options: 'i' }
          },
          {"address.pin" : {
            $regex:search , $options: 'i' }
          },
          // {"address.country" : {
          //   $regex:search , $options: 'i' }
          // }
        ]
        models.brokerModel.find(query).distinct("_id").exec()
        .then(function(brokers) {
          callback(null, plants,suppliers,brokers);
        }) // get related plant ids ends
        .catch(function(err) {
          logger.error(err);
          callback(err, plants,suppliers,brokers);
        })
      },
      function(plants,suppliers,brokers, callback){
        // get related  rawMaterial ids
        query["$or"] = [
          {rmGroupName : {
            $regex:search , $options: 'i' }
          },
          {name : {
            $regex:search , $options: 'i' }
          },
          {rmCode : {
            $regex:search , $options: 'i' }
          },
          {format : {
            $regex:search , $options: 'i' }
          },
          {variety : {
            $regex:search , $options: 'i' }
          },
          // {country : {
          //   $regex:search , $options: 'i' }
          // }

        ]
        models.rawMaterialModel.find(query).distinct("_id").exec()
        .then(function(rawMaterials) {
          callback(null, plants,suppliers,brokers,rawMaterials);
        }) // get related plant ids ends
        .catch(function(err) {
          logger.error(err);
          callback(err, plants,suppliers,brokers,rawMaterials);
        })
      },
      function(plants,suppliers,brokers,rawMaterials, callback){
        // console.log("plants ",plants);
        // console.log("suppliers ",suppliers);
        // console.log("brokers ",brokers);
        // console.log("rawMaterials ",rawMaterials);
        //getting records
        var query = {};
        query["$or"] = [
        {
          plant:{"$in":plants}
        },
        {
          supplier:{"$in":suppliers}
        },
        {
          broker:{"$in":brokers}
        },
        {
          rawMaterial:{"$in":rawMaterials}
        },
        //give input as country show as output that field which is related country
        // {country : {
        //   $in:search.split(",")  }
        // },
        //give input as containerNo show as output that field which is related containerNo
        {containerNo : {
          $regex:search , $options: 'i' }
        },

        //give input as lotNo show as output that field which is related lotNo
        {lotNo  : {
          $regex:search , $options: 'i' }
        },
        //give input as po  show as output that field which is related po
       {po    : {
          $regex:search , $options: '' }
        },
        //give input as variety show as output that field which is related variety
        {variety  : {
          $regex:search , $options: 'i' }
        }

       ]

	   models.recordModel.find(query)
     .populate("plant supplier broker rawMaterial")
     .exec()
     .then(function(data){
       callback(null,data)
     })
     .catch(function(err) {
         callback(err,null)
     })


      }
    ], function (err, data) {
      if(err){
        // return response.sendResponse(res, 500,"error",constants.messages.error.getData,err);
        recurssiveSearch(searches,-1,null,err,callback); // will break recurrsion with err value
      }
      else{
        // return response.sendResponse(res,200,"success",constants.messages.success.getData,data);
        resultArr.push(data);
        console.log("total record >>>>> searched   -  "+data.length);
        console.log("resultArr End - length   -  "+resultArr.length);
        recurssiveSearch(searches,++count,resultArr,null,callback);
      }
    });

  }
  catch(err) {
    return response.sendResponse(res, 500,"error",constants.messages.error.getData,err);
  }

}
/*
* Name : saveAttachments
* Info : this is used to save attachment , after multer uploaded file the server
*/
exports.saveAttachments = function(req,res) {
  try{
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
    // models.recordModel.update({_id:req.body._id},
    //   {
    //     billOfLanding:billOfLanding,
    //     commercialInvoice:commercialInvoice,
    //     packingList:packingList,
    //     coa:coa,
    //     ccpVerification:ccpVerification,
    //     environmentalMonitoring:environmentalMonitoring,
    //     otherSupporting:otherSupporting,
    //     isSetDocument: true // update flag for the document
    //   }  ,
    //   { multi:true} ,
    //   function(err,data) {
    //     if(err){
    //       return response.sendResponse(res, 500,"error",constants.messages.error.saveData,err);
    //     }
    //     else{
    //       return response.sendResponse(res,200,"success",constants.messages.success.saveData,data);
    //     }
    //   }
    // )
    models.recordModel.findById(req.body._id).exec()
    .then(function(record) {
      if(!record) {
        throw (new Error(constants.error.dataNotFound));
      }
      models.recordModel.update({_id:req.body._id},
        {
          billOfLanding:record.billOfLanding.concat(billOfLanding),
          commercialInvoice:record.commercialInvoice.concat(commercialInvoice),
          packingList:record.packingList.concat(packingList),
          coa:record.coa.concat(coa),
          ccpVerification:record.ccpVerification.concat(ccpVerification),
          environmentalMonitoring:record.environmentalMonitoring.concat(environmentalMonitoring),
          otherSupporting:record.otherSupporting.concat(otherSupporting),
          isSetDocument: true // update flag for the document
        }  ,
        { multi:true} ,
        function(err,data) {
          if(err){
            throw err;
          }
          else{
            return response.sendResponse(res,200,"success",constants.messages.success.saveData,data);
          }
        }
      )
    })
    .catch(function(err) {
      throw err;
    })
  }
  catch(err) {
     return response.sendResponse(res, 500,"error",constants.messages.error.saveData,err);
  }
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


 exports.deleteSamplePreparation = function(req,res) {
    try {
      if(!req.params._id){
        return response.sendResponse(res, 402,"error",constants.messages.error.sampleCollectionIdRequired);
      }
      if(!req.params.sampleId){
        return response.sendResponse(res, 402,"error",constants.messages.error.sampleIdRequired);
      }
      var query = {
        _id:req.params._id
      };
      var update = {
        "$pull":{"samples":{"_id":req.params.sampleId } }
      }
      var options = {
        new:true
      }
      models.sampleCollectionModel.findOneAndUpdate(query,update,options)
      .then(function(record) {
        return response.sendResponse(res, 200,"success",constants.messages.success.updateData,record);
      })
      .catch(function(err) {
        throw err;
      })

    } catch (e) {
      return response.sendResponse(res, 500,"error",constants.messages.error.updateData,err);
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

exports.deleteSamplePreparationSample = function(req,res) {
    try {
      if(!req.params._id){
        return response.sendResponse(res, 402,"error",constants.messages.error.sampleCollectionIdRequired);
      }
      if(!req.params.sampleId){
        return response.sendResponse(res, 402,"error",constants.messages.error.sampleIdRequired);
      }
      var query = {
        _id:req.params._id
      };
      var update = {
        "$pull":{"samples":{"_id":req.params.sampleId } }
      }
      var options = {
        new:true
      }
      models.samplePreparaionModel.findOneAndUpdate(query,update,options)
      .then(function(record) {
        return response.sendResponse(res, 200,"success",constants.messages.success.deleteData,record);
      })
      .catch(function(err) {
        throw err;
      })

    } catch (e) {
      return response.sendResponse(res, 500,"error",constants.messages.error.deleteData,err);
    }
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
              fileName: ((new Date()).getTime())+req.body.fileName// append current time
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
                fileName: ((new Date()).getTime())+req.body.fileName
              },uploadPath, function(err, imagePath) {
                if (err) {
                  logger.error("udpateUser  " + err);
                  return response.sendResponse(res, 500,"error",constants.messages.error.imageUpload,err);
                }
                req.body.caseImg = imagePath;
                sampleCollectionData.samples = sampleCollectionData.samples.concat([req.body]);
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
  exports.deleteSample = function(req,res) {
    try {
      if(!req.params._id){
        return response.sendResponse(res, 402,"error",constants.messages.error.sampleCollectionIdRequired);
      }
      if(!req.params.sampleId){
        return response.sendResponse(res, 402,"error",constants.messages.error.sampleIdRequired);
      }
      var query = {
        _id:req.params._id
      };
      var update = {
        "$pull":{"samples":{"_id":req.params.sampleId } }
      }
      var options = {
        new:true
      }
      models.sampleCollectionModel.findOneAndUpdate(query,update,options)
      .then(function(record) {
        return response.sendResponse(res, 402,"error",constants.messages.success.updateData,record);
      })
      .catch(function(err) {
        throw err;
      })

    } catch (e) {
      return response.sendResponse(res, 500,"error",constants.messages.error.updateData,err);
    }
  }
  /***
  ** info : taking request body of the sample and update data
          update image path if image is present in base 64
          where sending base64 is optional
  ***/
  exports.updateSampleCollectionSample = function(req,res) {
    try {
      var index;
      var uploadPath = config.get(config.get("env")+".uploadPath")+"/sampleCollection";
      models.sampleCollectionModel.findOne({"samples._id":req.body._id}).exec()
      .then(function(sampleCollectionData) {
        if(!sampleCollectionData){
          throw (new Error(constants.error.dataNotFound));
        }
        // looping to get the sample
        for(var i in sampleCollectionData.samples){
          if(sampleCollectionData.samples[i]._id == req.body._id){
            // check for the base64 image
            index = i;
            break;
          }
        }
        if(req.body.base64 && req.body.fileName){
          // upload image
          component.utility.uploadImage({
            base64: req.body.base64,
            fileName: ((new Date()).getTime())+req.body.fileName
          },uploadPath, function(err, imagePath) {
            if (err) {
              logger.error("udpateUser  " + err);
              return response.sendResponse(res, 500,"error",constants.messages.error.imageUpload,err);
            }
            req.body.caseImg = imagePath;
            sampleCollectionData.samples[i] = req.body;
            sampleCollectionData.save(function(err,data) {
              if(err) {
                throw err;
              }
              return response.sendResponse(res, 200,"success",constants.messages.success.updateData);
            })
          })
        }
        else{
          // direct upload request data
          sampleCollectionData.samples[i] = req.body;
          sampleCollectionData.save(function(err,data) {
            if(err) {
              throw err;
            }
            return response.sendResponse(res, 200,"success",constants.messages.success.updateData);
          })
        }

      })
      .catch(function(err) {
        throw err;
      })

    } catch (err) {
      return response.sendResponse(res, 500,"error",constants.messages.error.updateData,err);
    }

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
