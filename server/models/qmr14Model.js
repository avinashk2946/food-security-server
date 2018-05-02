/**
 * Composite key for raw materials to be created from mongo console
 * with supplier id and country
 */

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var qmr14Schema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    formId: mongoose.Schema.Types.ObjectId,
    header: {},
    data: {},
    categoryId:mongoose.Schema.Types.ObjectId,
    subCategoryId:mongoose.Schema.Types.ObjectId
});
// rawMatrialSchema.plugin(uniqueValidator, {message: constants.messages.error.roleExist});

module.exports = mongoose.model('qmr14', qmr14Schema);;
