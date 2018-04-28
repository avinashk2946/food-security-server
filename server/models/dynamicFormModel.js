const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    constants = require("./../../config/constants"),
    Schema = mongoose.Schema,
    dynamicFormSchema = new mongoose.Schema({
        formTypeId: {type: Schema.Types.ObjectId, ref: 'formtypes',unique: true},
        unitTypeId: {type: Schema.Types.ObjectId, ref: 'unittypes'},
        companyId: {type: Schema.Types.ObjectId, ref: 'companies'},
        labels: [String],
        formMetaData: Schema.Types.Mixed,
        status: { type: Boolean, default: false },
        createdDate: { type: Date, default: new Date() },
        modifiedDate: { type: Date, default: new Date() },
        createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'users' }
    });
dynamicFormSchema.plugin(uniqueValidator, { message: constants.messages.error.templateExists });
const dynamicFormModel = mongoose.model('dynamicForm', dynamicFormSchema);

module.exports = dynamicFormModel;
