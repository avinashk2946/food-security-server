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
      "invalidEmail" : "Invalid Email",
      "undefinedPlantId" : "Plant id is required",
      "undefinedSalutation" : "Salutation is required",
      "undefinedFirstName" : "First Name is required",
      "invalidInput" :"Invalid Input",

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
      "imageUpload"     : "Error in upload Image",
      "sampleLimit"     : "Sample Limit crossed",

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
      "resetPasswordMailSent" : "Verification mail sent for reset password",
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
  gmailSMTPCredentials :{
    username:"rajendrasahoodbpb",
    password:"Dbpb*raju1987",
    mailUsername:"smartfoodsafe",
    verificationMail:"admin@smartfoodsafe.com"
  },
  uiUrl:{
    resetPasswordUrl : config.get(config.get("env")+".clientHost")+"/resetPassword"
  },
  emailTemplate : {
    resetPassword :{
      header : "Reset password",

      content : `Hello {{name}} , \n
                      Kindly click on the below link to reset password\n
                      {{resetUrl}}
                                  `
    }
  }

}
module.exports = constants;
