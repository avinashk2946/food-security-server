const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    constants = require("./../../config/constants"),
    genericMasterSchema = new mongoose.Schema({
        name: { type: String, unique: true },
        status: { type: Boolean, default: false },
        createdDate: { type: Date, default: new Date() },
        modifiedDate: { type: Date, default: new Date() },
        createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'user' }
    });

module.exports = (model) => {
    genericMasterSchema.plugin(uniqueValidator, { message: constants.messages.error.dataExists });
    const genericMasterModel = mongoose.model(model, genericMasterSchema);
    return genericMasterModel;
};
