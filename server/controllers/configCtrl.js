var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('configCtrl');
var config = require("config");
var component = require("./../component/index");
var waterfall = require('async-waterfall');

exports.addConfig = function(req, res) {
  try {
    // component.utility.uploadImage({base64:req.body.backgroundImg,fileName:req.body.backgroundImgName},function(err,data){
    //   console.log("upload image ",err,data);
    // })
    waterfall([
      function(callback) {
        if (!req.body.backgroundImg || !req.body.backgroundImgName)
          callback(null);
        else {
          // upload base 64 file
          component.utility.uploadImage({
            base64: req.body.backgroundImg,
            fileName: req.body.backgroundImgName
          } , null, function(err, imagePath) {
            if (err) {
              logger.error("udpateUser  " + err);
              callback(err);
            } else {
              req.body.backgroundImg = imagePath;
              callback(null);
            }
          })
        }
        //callback(Error('Demo Error'), 'one', 'two');
      },
      function(callback) {
        if (!req.body.logoImg || !req.body.logoImgName)
          callback(null);
        else {
          // upload base 64 file
          component.utility.uploadImage({
            base64: req.body.logoImg,
            fileName: req.body.logoImgName
          },null, function(err, imagePath) {
            if (err) {
              logger.error("udpateUser  " + err);
              callback(err);
            } else {
              req.body.logoImg = imagePath;
              callback(null);
            }
          })
        }
      }
    ], function(err, result) {
      if (err) {
        logger.error("udpateUser  " + err);
        component.LOG.error(err)
      } else {
        new models.configModel(req.body).save(function(err) {
          if (err) {
            logger.error("addConfig ", err);
            return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
          } else {
            return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
          }
        })
      }
    });


  } catch (e) {
    logger.error("addConfig ", e);
  }
}
exports.getConfig = function(req, res) {
  try {
    var params = {
      isDelete: false,
      //type:{$in:["aa","consultant","bm"]}
    };
    if (req.query._id) {
      params['_id'] = req.query._id;
    }
    if (req.query.type) {
      params['type'] = req.query.type;
    }
    models.configModel.find(params, function(err, data) {
      if (err) {
        logger.error("getConfig ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.getData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    })

  } catch (e) {
    logger.error("getConfig ", e);
  }
}
exports.getConfigById = function(req, res) {
  console.log("req.params.id  ", req.params.id);
  models.configModel.findById(req.params.id, function(err, config) {
    if (err) {
      return response.sendResponse(res, 500, "error", constants.messages.error.getData, err);
    } else {
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, config);
    }
  })
}
exports.udpateConfig = function(req, res) {
  try {
    var query = {
      "_id": req.body.id
    }
    delete req.body['_id'];
    var options = {
      new: true
    };
    waterfall([
      function(callback) {
        if (!req.body.backgroundImg || !req.body.backgroundImgName)
          callback(null);
        else {
          // upload base 64 file
          component.utility.uploadImage({
            base64: req.body.backgroundImg,
            fileName: req.body.backgroundImgName
          },null, function(err, imagePath) {
            if (err) {
              logger.error("udpateUser  " + err);
              callback(err);
            } else {
              req.body.backgroundImg = imagePath;
              callback(null);
            }
          })
        }
        //callback(Error('Demo Error'), 'one', 'two');
      },
      function(callback) {
        if (!req.body.logoImg || !req.body.logoImgName)
          callback(null);
        else {
          // upload base 64 file
          component.utility.uploadImage({
            base64: req.body.logoImg,
            fileName: req.body.logoImgName
          },null, function(err, imagePath) {
            if (err) {
              logger.error("udpateUser  " + err);
              callback(err);
            } else {
              req.body.logoImg = imagePath;
              callback(null);
            }
          })
        }
      }
    ], function(err, result) {
      if (err) {
        logger.error("udpateConfig 1 " + err);
        component.LOG.error(err)
        return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
      } else {
        models.configModel.findOneAndUpdate(query, req.body, options).exec()
          .then(function(data) {
            return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
          })
          .catch(function(err) {
            logger.error("udpateConfig 2", err);
            return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
          })
      }
    });
    // models.configModel.findOneAndUpdate(query, req.body,options).exec()
    // .then(function(data) {
    //   return response.sendResponse(res,200,"success",constants.messages.success.updateData,data);
    // })
    // .catch(function(err) {
    //   logger.error("udpateConfig ", err);
    //   return response.sendResponse(res, 500,"error",constants.messages.error.updateData,err);
    // })

  } catch (err) {
    logger.error("udpateConfig ", err);
    return response.sendResponse(res, 500, "error", constants.messages.error.updateData, err);
  }
}
exports.deleteConfig = function(req, res) {
  try {
    var query = {
      "_id": req.params.id
    }
    delete req.body['_id'];
    models.configModel.findOneAndUpdate(query, {
      "isDelete": true
    }, {
      "new": true
    }, function(err, data) {
      if (err) {
        logger.error("deleteConfig ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.deleteData, err);
      } else
        return response.sendResponse(res, 200, "success", constants.messages.success.deleteData);
    })

  } catch (e) {
    logger.error("deleteConfig ", e);
  }
}
