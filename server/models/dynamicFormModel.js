const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    constants = require("./../../config/constants"),
    Schema = mongoose.Schema,
    dynamicFormSchema = new mongoose.Schema({
        formTypeId: {type: Schema.Types.ObjectId, ref: 'formtypes'},
        labels: [String],
        formMetaData: Schema.Types.Mixed,
        createdDate: { type: Date, default: new Date() }
    });
dynamicFormSchema.plugin(uniqueValidator, { message: constants.messages.error.templateExists });
const dynamicFormModel = mongoose.model('dynamicForm', dynamicFormSchema);

module.exports = dynamicFormModel;
