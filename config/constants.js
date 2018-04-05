var config = require('config');
var constants = {
  debug:true,
  roles:['state-admin','district-admin','vle'],
  userStatus:['active','pending','inactive'],
  blockTypes:['GP','URBAN'],
  urbanTypes:['Municipality','Nsc','Others'],
  messages:{
    error:{
      // generic
      "saveData"  : "Error in saving data",
      "getData"  : "Error in get data",
      "updateData"  : "Error in update data",
      "deleteData"  : "Error in delete data",
      "dataNotFound" : "Data not found",
      //Role
      "roleExist" : "Role Already Exists !",
      "saveRole" : "Error in saving Role",



      //user
      "undefinedUsername":"Undefined Username",
      "undefinedPassword":"Undefined Password",
      "clientIdExist":"Client id already exists !",
      "customerExist":"Customer  already exists !",
      "saveUser" : "Error in save user",
      "undefinedEmail" : "Email required",
      "undefinedPlantId" : "Plant id is required",
      "undefinedSalutation" : "Salutation is required",
      "undefinedFirstName" : "First Name is required",

      //plant

      "plantExist" : "Plant Already Exists !",
      "savePlant" : "Error in saving Plant",

      //product

      "productExist" : "product Already Exists !",
      "saveProduct" : "Error in saving Product",

      // rawMatrial

      //constants

      "saveConstant" : "Error in saving unit",

      //Record

      "saveRecord" : "Error in saving record",
      "recordIdRequired" : "Record Id Required",
      "record_Supp_idRequired" : "Record or supplier Id required",
      "sampleCollectionIdRequired" : "Sample Collection Id required",

      },
    success:{

      // generic
      "saveData"  : "Success in saving data",
      "getData"  : "Success in get data",
      "updateData"  : "success in update data",
      "deleteData"  : "success in delete data",

      //role
      "saveRole" : "Role saved",

      //user
      "saveUser" : "Save User success",

      //plant
      "savePlant" : "plant saved",

      //product
      "saveProduct" : "Product saved",

      //constants
      "saveConstant" : "unit saved",

      //Record
      "saveRecord" : "record saved",

    },
  },

}
module.exports = constants;
