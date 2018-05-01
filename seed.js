var db = require('./server/db');
var LOG = require("./server/component/LOG");
var waterfall = require('async-waterfall');
var password = require('password-hash-and-salt');
var Promise = require('promise');
var parseXlsx  = require('excel');
var models = require("./server/models/index.js");
var controllers = require("./server/controllers/index.js");
var mongoose = require("mongoose");
var arrayUnique = require('array-unique');
//*********************  Role schema  *************//
// console.log(workbook.SheetNames);
// return;
var sheetCounter = 0 ; // used to read sheet no.
var recordCounter = 0;
var config = {
  password : "food-safe",
  filePath : "test.xlsx"
}
function init(sheetCounter){
  if(sheetCounter > 5) {
    console.log("\n\n\n Seeding completed !!!!\n\n\n\n");
    return; // break recurssion
  }
  parseXlsx(config.filePath,sheetCounter,function(err,data) {
     if(err)
     {
       LOG.error(err);
       console.log(err);
     }
    else{
      // LOG.info("data read "+data);
      // console.log(data);
      switch (sheetCounter) {
        case 1:
          // process client
          processClient(data,function(err,res) {
            if(err)
            {
              LOG.error("Error in processClient"+err);
              console.log(err);
              return ; // break recurssion
            }
            else{
              console.log("************  Client Seed completed *******************");
              init(++sheetCounter);
            }
          });
          break;
        case 2:
        processRole(data,function(err,recordArr) {
          if(err)
          {
            LOG.error("Error in processRole"+err);
            console.log(err);
            return ; // break recurssion
          }
          else{
            models.roleModel.insertMany(recordArr)
            .then(function(roles) {
              console.log("************  Role Seed completed *******************");
              init(++sheetCounter);
            })
            .catch(function(err) {
              LOG.error("Error in processRole"+err);
              console.log(err);
              return ; // break recurssion
            })

          }
        });
          break;
        case 3:
        processPlant(data,function(err,recordArr) {
          if(err)
          {
            LOG.error("Error in processPlant"+err);
            console.log(err);
            return ; // break recurssion
          }
          else{
            console.log("recordArr ");
            // console.log(recordArr);
            models.plantModel.insertMany(recordArr)
            .then(function(roles) {
              console.log("************  Plant Seed completed *******************");
              init(++sheetCounter);
            })
            .catch(function(err) {
              LOG.error("Error in processPlant"+err);
              console.log(err);
              return ; // break recurssion
            })

          }
        });
          break;
        case 4:
        processUser(data,function(err,recordArr) {
          if(err)
          {
            LOG.error("Error in processUser"+err);
            console.log(err);
            return ; // break recurssion
          }
          else{
            console.log("recordArr ");
            console.log(recordArr);
            models.userModel.insertMany(recordArr)
            .then(function(roles) {
              console.log("************  User Seed completed *******************");
              init(++sheetCounter);
            })
            .catch(function(err) {
              LOG.error("Error in processUser"+err);
              console.log(err);
              return ; // break recurssion
            })

          }
        });
          break;
        case 5:
        processSupplier(data,function(err,recordArr) {
          if(err)
          {
            LOG.error("Error in processSupplier"+err);
            console.log(err);
            return ; // break recurssion
          }
          else{
            console.log("************  Supplier Seed completed *******************");
            init(++sheetCounter);
          }
        });
          break;
        case 5:

          break;
        case 6:

          break;
        case 7:

          break;
        case 8:

          break;
        default:

      }
    }
  })
}
init(++sheetCounter);

function processClient(data,callback) {
  var headers = data[0]; // array of String represents headers in excel
  var recordArr = [];
  for(var i = 1 ; i < data.length ; i ++){
    var recordObj = {};
    for(var j = 0 ; j < data[i].length ; j ++){
      recordObj[headers[j]] = data[i][j];
    }
    recordArr.push(recordObj);
  }
  // insert client
  models.clientModel.insertMany(recordArr)
  .then(function(res) {
    callback(null,sheetCounter);
  })
  .catch(function(err){
    callback(err,null);
  })
}

/******** roles starts ********/
function processRole(data,callback) {
  var headers = data[0]; // array of String represents headers in excel
  var recordArr = [];
  recordCounter = 1; // to start with index 1
  seedRole(headers,recordArr,data,recordCounter,callback) // client,clientId should be null for the 1st instance
}
function seedRole(headers,recordArr,data,recordCounter,callback) {
  if(recordCounter > data.length-1) {
    return callback(null,recordArr);
  }
  else{
    models.clientModel.findOne({name:(data[recordCounter][0]).trim()})
    .exec()
    .then(function(client) {
      recordObj = {};
      for(var j = 0 ; j < data[recordCounter].length ; j ++){
        if(j == 0) {
          recordObj[headers[j]] = client._id;
        }
        else{
          recordObj[headers[j]] = data[recordCounter][j];
        }

      }
      recordArr.push(recordObj);
      seedRole(headers,recordArr,data,++recordCounter,callback);
    })
    .catch(function(err) {
      return callback(err,null);
    })
  }
}
/******** roles ends ********/








/******** plant starts ********/
function processPlant(data,callback) {
  var headers = data[0]; // array of String represents headers in excel
  var recordArr = [];
  recordCounter = 1; // to start with index 1
  seedPlant(headers,recordArr,data,recordCounter,callback) // client,clientId should be null for the 1st instance
}
function seedPlant(headers,recordArr,data,recordCounter,callback) {
  if(recordCounter > data.length-1) {
    return callback(null,recordArr);
  }
  else{
    models.clientModel.findOne({name:(data[recordCounter][0]).trim()})
    .exec()
    .then(function(client) {
      recordObj = {};
      for(var j = 0 ; j < data[recordCounter].length ; j ++){
        if(j == 0) {
          recordObj[headers[j]] = client._id;
        }
        else{
          recordObj[headers[j]] = data[recordCounter][j];
        }

      }
      recordArr.push(recordObj);
      seedPlant(headers,recordArr,data,++recordCounter,callback);
    })
    .catch(function(err) {
      return callback(err,null);
    })
  }
}
/******** plant ends ********/








/******** user starts ********/
function processUser(data,callback) {
  var headers = data[0]; // array of String represents headers in excel
  var recordArr = [];
  recordCounter = 1; // to start with index 1
  seedUser(headers,recordArr,data,recordCounter,callback) // client,clientId should be null for the 1st instance
}
function seedUser(headers,recordArr,data,recordCounter,callback) {
  if(recordCounter > data.length-1) {
    return callback(null,recordArr);
  }
  else{
    var clientId = null,roleId = null, plantId = null,passwordHash = null;
    models.clientModel.findOne({name:(data[recordCounter][0]).trim()})
    .exec()
    .then(function(client) {
      clientId = client._id;

      return models.roleModel.findOne({type:(data[recordCounter][1]).trim()})
    })
    .then(function(role) {
      roleId = role._id;

      return models.plantModel.findOne({plantId:(data[recordCounter][2]).trim()})
    })
    .then(function(plant) {
      plantId = plant._id;
      return new Promise(function(resolve, reject) {
        password(config.password).hash(function(error, hash) {

          if (error) {
            reject(error)
          } else {
            resolve(hash);
          }
        });

      })
    })
    .then(function(hash) {
      // getting password hash code
      passwordHash = hash;
      recordObj = {};

      for(var j = 0 ; j < data[recordCounter].length ; j ++){
        if(j == 0) {
          console.log('clientId',clientId);
          recordObj[headers[j]] = clientId;
        }
        else if(j == 1) {
          console.log('roleId',roleId);
          recordObj[headers[j]] = roleId;
        }
        else if(j == 2) {
          console.log('plantId',plantId);
          recordObj[headers[j]] = plantId;
        }
        else if(j == 8) {
          console.log('passwordHash ',passwordHash);
          recordObj[headers[j]] = passwordHash;
        }
        else{
          recordObj[headers[j]] = data[recordCounter][j] || null;
        }
      }
      console.log("recordObj  ",recordObj);
      recordArr.push(recordObj);
      seedUser(headers,recordArr,data,++recordCounter,callback);
    })
    .catch(function(err) {
      return callback(err,null);
    })
  }
}
/******** user ends ********/









/******** supplier  starts ********/
function processSupplier(data,callback) {
  var headers = data[0]; // array of String represents headers in excel
  var recordArr = [];
  recordCounter = 1; // to start with index 1
  seedSupplier(headers,recordArr,data,recordCounter,callback)
}
function seedSupplier(headers,recordArr,data,recordCounter,callback) {
  if(recordCounter > data.length-1) {
    return callback(null,recordArr);
  }
  else{
    var clientId = null, plantId = null,passwordHash = null;
    models.clientModel.findOne({name:(data[recordCounter][0]).trim()})
    .exec()
    .then(function(client) {
      clientId = client._id;

      return models.plantModel.findOne({plantId:(data[recordCounter][1]).trim()})
    })
    .then(function(plant) {
      plantId = plant._id;
      return models.supplierModel.findOne({id:(data[recordCounter][2]).trim()})
    })
    .then(function(supplier) {
      if(supplier){
        // update with plant and address array
        supplier.plants.push(plantId)
        supplier.plants = arrayUnique(supplier.plants); // make unique plant id
        var address = {};
        for(var j = 0 ; j < data[recordCounter].length ; j ++){
          if(j == 0) {
            console.log('clientId',clientId);
            recordObj[headers[j]] = clientId;
          }
          else if(j == 1) {
            console.log('plantId',plantId);
            supplier.plants.push(plantId)
            recordObj[headers[j]] = arrayUnique(supplier.plants); // make unique plant id
          }
          else if(j == 2) {
            console.log('plantId',plantId);
            recordObj[headers[j]] = plantId;
          }
          else if(j == 5 || j == 6 || j == 7 || j == 8) {
            address[headers[j]] = data[recordCounter][j]
          }
          else{
            recordObj[headers[j]] = data[recordCounter][j] || null;
          }
        }
        supplier.address.push(address);
        supplier.address = arrayUnique(supplier.address); // make unique plant id
        // saving existing supplier
        supplier.save(function(err,supplierData) {
          if(err)
            callback(err,null)
          else
            seedSupplier(headers,recordArr,data,++recordCounter,callback);
        })
      }
      else{
        // insert new record
        recordObj = {};
        address = {};
        for(var j = 0 ; j < data[recordCounter].length ; j ++){
          if(j == 0) {
            console.log('clientId',clientId);
            recordObj[headers[j]] = clientId;
          }
          else if(j == 1) {
            console.log('plantId',plantId);
            recordObj[headers[j]] = [plantId]; // putting plant id in array
          }
          else if(j == 5 || j == 6 || j == 7 || j == 8) {
            address[headers[j]] = data[recordCounter][j];
          }
          else{
            recordObj[headers[j]] = data[recordCounter][j] || null;
          }
        }
        recordObj.address = [address];
        console.log("recordObj  ",recordObj);
        // recordArr.push(recordObj);
        // seedSupplier(headers,recordArr,data,++recordCounter,callback);
        new models.supplierModel(recordObj).save(function (err) {
          if(err)
            callback(err,null);
          else{
            seedSupplier(headers,recordArr,data,++recordCounter,callback);
          }
        })
      }

      // console.log("recordObj  ",recordObj);
      // recordArr.push(recordObj);
      // seedSupplier(headers,recordArr,data,++recordCounter,callback);
    })
    .catch(function(err) {
      return callback(err,null);
    })
  }
}
/******** supplier ends ********/
