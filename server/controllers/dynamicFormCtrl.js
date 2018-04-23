const express = require('express'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  router = express.Router(),
  bodyParser = require('body-parser'),
  colors = require('colors'),
  response = require("./../component/response"),
  models = require("./../models/index"),
  constants = require("./../../config/constants"),
  logger = require("./../component/log4j").getLogger('dynamicFormCtrl');

exports.addDynamicForm = function (req, res) {
  try {
    new models.dynamicFormModel(req.body).save(function (err) {
      if (err) {
        logger.error("addDynamicForm ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
      }
      else {
        return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
      }
    });
  } catch (e) {
    logger.error("addDynamicForm=> ", e);
  }
}

exports.getDynamicForm = function (req, res) {
  try {
    let params = {};
    if (req.query.id) {
      params['_id'] = req.query.id;
    }
    models.dynamicFormModel.find(params, function (err, data) {
      if (err) {
        logger.error("getDynamicForm ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.getData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
    });
  } catch (e) {
    logger.error("getDynamicForm ", e);
  }
}

exports.updateDynamicForm = function (req, res) {
  try {
    const query = {
    },
    updateData =  req.body,
    option = {
      new:true,
      multi:true
    };
    models.dynamicFormModel.update(query,updateData,option,function(err,user) {
      if (err) {
        logger.error("updateDynamicForm ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.updateData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.updateData, data);
    });
  } catch (e) {
    logger.error("updateDynamicForm ", e);
  }
}