var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var colors = require('colors');
var response = require("./../component/response");
var models = require("./../models/index");
var constants = require("./../../config/constants");
var logger = require("./../component/log4j").getLogger('rawMaterialCtrl');
exports.saveData = async (req, res, next) => {
    if(!req.body.formId){
        return response.sendResponse(res, 400, "Bad Request", constants.messages.error.invalidInput);
    }
    try {
        await models.qmr14Model.update({ formId: req.body.formId }, req.body, { upsert: true, runValidators: true })
        return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
    }
    catch (err) {

    }
}