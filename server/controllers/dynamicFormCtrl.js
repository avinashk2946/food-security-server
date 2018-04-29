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
    //to verify whether template alraedy exists for given company, plant & form type, if yes user need to make update API call
    const params = { "plantId": req.body.plantId, "companyId": req.body.companyId, "formTypeId": req.body.formTypeId };
    models.dynamicFormModel.find(params, function (err, data) {
      if (err) {
        logger.error("addDynamicForm ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
      }
      if (data.length == 0) {
        //for a company, plant & form type combination, only one record can be present
        new models.dynamicFormModel(req.body).save(function (err) {
          if (err) {
            logger.error("addDynamicForm ", err);
            return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
          }
          else {
            return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
          }
        });
      }
      else {
        return response.sendResponse(res, 200, "error", constants.messages.error.templateExists, data);
      }
    });
  } catch (e) {
    logger.error("addDynamicForm=> ", e);
    return response.sendResponse(res, 500, "error", constants.messages.error.getData, e.stack);
  }
}

exports.getDynamicForm = function (req, res) {
  try {
    let params = {};
    if (req.query.id) {
      params['_id'] = req.query.id; //Get By Id () By Dynamic Form Id)
    }
    if (req.path.match("search")) { // search by attributes
      params = req.body || {};
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
    return response.sendResponse(res, 500, "error", constants.messages.error.getData, e.stack);
  }
}

exports.updateDynamicForm = function (req, res) {
  try {
    const query = { "_id": req.params.id },
      updateData = req.body,
      option = {
        new: true,
        multi: true
      };
    models.dynamicFormModel.update(query, updateData, option, function (err, user) {
      if (err) {
        logger.error("updateDynamicForm ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.updateData, err);
      }
      return response.sendResponse(res, 200, "success", constants.messages.success.updateData, user);
    });
  } catch (e) {
    logger.error("updateDynamicForm ", e);
    return response.sendResponse(res, 500, "error", constants.messages.error.getData, e.stack);
  }
}