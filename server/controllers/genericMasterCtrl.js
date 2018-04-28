var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('genericMasterCtrl');

exports.create = function (req, res) {
  try {
    const genericMasterModel = require("./../models/genericMasterModel")(req.params.model);
    new genericMasterModel(req.body).save(function (err) {
      if (err) {
        logger.error("create genericMaster=> " + req.params.model, err);
        return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
      }
      else {
        return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
      }
    })

  } catch (e) {
    logger.error("create genericMaster=> " + req.params.model, e);
    return response.sendResponse(res, 500, "error", constants.messages.error.saveData, e.stack);
  }
}
exports.read = function (req, res) {
  try {
    let params = {}; // get all
    if (req.query.id) { // get by id
      params['_id'] = req.query.id;
    }
    if (req.path.match("search")) { // search
      params = req.body || {};
    }
    const genericMasterModel = require("./../models/genericMasterModel")(req.params.model);
    genericMasterModel.find(params, function (err, data) {
      if (err) {
        logger.error("get genericMaster=> " + req.params.model, err);
        return response.sendResponse(res, 500, "error", constants.messages.error.getData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    })

  } catch (e) {
    logger.error("get genericMaster=> " + req.params.model, e);
    return response.sendResponse(res, 500, "error", constants.messages.error.getData, e.stack);
  }
}
exports.update = function (req, res) {
  try {
    const query = { "_id": req.params.id },
      options = { new: true },
      genericMasterModel = require("./../models/genericMasterModel")(req.params.model);
      genericMasterModel.findOneAndUpdate(query, req.body, options).exec()
      .then(function (data) {
        return response.sendResponse(res, 200, "success", constants.messages.success.udpate, data);
      })
      .catch(function (err) {
        logger.error("update genericMaster=> " + req.params.model, err);
        return response.sendResponse(res, 500, "error", constants.messages.error.udpate, err);
      })

  } catch (e) {
    logger.error("update genericMaster=> " + req.params.model, e);
    return response.sendResponse(res, 500, "error", constants.messages.error.update, e.stack);
  }
}

/*
exports.delete = function (req, res) {
  try {
    var query = {
      "_id": req.params.id
    }
    models.roleModel.findOneAndUpdate(query, { "isDelete": true }, { "new": true }, function (err, data) {
      if (err) {
        logger.error("deleteRole ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.deleteRole, err);
      }
      else
        return response.sendResponse(res, 200, "success", constants.messages.success.deleteRole);
    })

  } catch (e) {
    logger.error("deleteRole ", e);
  }
}
*/
