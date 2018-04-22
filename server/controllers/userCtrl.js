var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var router = express.Router();
var bodyParser = require('body-parser');
var LOG = require('./../component/LOG');
var response = require("./../component/response");
var constants = require("./../../config/constants");
var userModel = require("./../models/userModel");
var password = require('password-hash-and-salt');
var jwt = require('jsonwebtoken');
var config = require('config');
var validator = require('validator');
var component = require('./../component/index');
var logger = require("./../component/log4j").getLogger('userCtrl');
var models = require('./../models/index');
var waterfall = require('async-waterfall');
// var async = require('async');
var utility = require('./../component/utility');
var passwordHash = require('password-hash-and-salt');

/*
 * this will be executed if authentication passes
 */
exports.verifiedUser = function(req, res, isError) {
  console.log("verified in ctrl");
  if (!isError) {
    response.sendResponse(res, 200, "success", constants.messages.success.verified);
  } else {
    console.log(isError);
    response.sendResponse(res, 200, "success", constants.messages.error.verified);
  }
}
var refreshToken = function(_id, callback) {
  var user;
  models.userModel.findById(_id).populate('role')
    .exec()
    .then(function(data) {
      user = data;
      return jwt.sign(user, config.token.secret, {
        expiresIn: config.token.expiry
      })
      //callback(false,user);
    })
    .then(function(token) {
      var data = {
        user: user,
        token: token
      }
      callback(false, data);
    })
    .catch(function(err) {
      callback(err, false);
    })

}
exports.login = function(req, res) {
  console.log("coming to server side control");
  // creating token that will send to the client side

  try {
    var token = jwt.sign(req.user, config.token.secret, {
        expiresIn: config.token.expiry
      },

      function(token) {
        var data = {
          user: req.user,
          token: token
        }

        response.sendResponse(res, 200, "success", constants.messages.success.login, data);
      });

  } catch (e) {
    LOG.error(e);
    logger.error("login  " + e);
    response.sendResponse(res, 500, "error", constants.messages.error.login, e);
  }
}
exports.addUser = function(req, res) {
  LOG.info("add user");
  // cheking validation
  try {

    var rawPassword = req.body.password;
    models.roleModel.findById(req.body.role)
      .then(function(role) {
        console.log(role + ">>>>>");
        if (!role) {
          return response.sendResponse(res, 400, "error", constants.statusCode['400']);
        }
        password(req.body.password).hash(function(error, hash) {
          req.body.password = hash; // encrypting the password
          new userModel(req.body).save(function(err, user) {
            if (err) {
              LOG.error(err.message);
              logger.error("addUser  " + err);
              return response.sendResponse(res, 500, "error", constants.messages.error.saveUser, err);
            } else {
              LOG.info("User saved !!!!");
              response.sendResponse(res, 200, "success", constants.messages.success.saveUser);

            }
          })
        })
      })
      .catch(function(err) {
        logger.error("addUser  " + err);
        response.sendResponse(res, 500, "error", constants.messages.error.saveUser, err);
      })
  } catch (e) {
    logger.error("addUser  " + e);
  }


}
// this only send client users only , for admin perspective
exports.getUser = function(req, res) {
  try {
    var params = {
      isDelete: false
    };

    if (req.query.role) {
      params['role'] = req.query.role;
    }
    // console.log("req.query._id   " + req.query._id);
    if (req.query._id) {
      var filter = {};
      params['_id'] = req.query._id;

      // if(req.query.viewType == "list"){
      //   filter = 'firstName lastName email';
      // }
      userModel.findOne(params, function(err, user) {
        return response.sendResponse(res, 200, "success", constants.messages.success.getUser, user);
      })
      // .catch(function(error) {
      //   return response.sendResponse(res, 200, "error", constants.messages.error.getUser, error);
      // })
    } else {
      // listing service
      var populateObj = {
        path: "role"
      };
      // if(req.query.userType == "in") // external user - client
      // {
      //   populateObj["match"] =  { "type": { "$eq": 'client' } }
      // }
      if (!req.query.role && req.query.userType == "in") // internal user - except client
      {
        populateObj["match"] = {
          "type": {
            "$ne": 'client'
          }
        }
      } else if (!req.query.role && req.query.userType == "clients") // client user
      {
        populateObj["match"] = {
          "type": {
            "$eq": 'client'
          }
        }
      }
      // else if(!req.query.role &&  (req.query.userType == "in" || !req.query.userType) ) {
      //   populateObj["match"] =  { "type": { "$eq": 'client' } }
      // }
      userModel.find(params)
        .populate(populateObj)
        .select('username email role mobile firstname lastname middlename ')
        .then(function(users) {
          users = users.filter(function(user) {
            if (user.role)
              return user; // return only users with email matching 'type: "Gmail"' query
          });
          return response.sendResponse(res, 200, "success", constants.messages.success.getUser, users);
        })
        .catch(function(error) {
          logger.error("getUser  " + error);
          return response.sendResponse(res, 200, "error", constants.messages.error.getUser, error);
        })
    }

  } catch (e) {
    logger.error("getUser  " + error);
  }

}

//find user basicDetails
exports.getUserBasicInfo = function(req, res) {
  try {
    var params = {
      isDelete: false
    };
    if (req.params.id) {
      var filter = {};
      params['_id'] = req.params.id;
    }
    models.userModel.find(params).select('firstName lastName  role  username')
      .exec()
      .then(function(data) {
        return response.sendResponse(res, 200, "success", constants.messages.success.getData, data);
      })
      .catch(function(err) {
        logger.error("getUserBasicInfo ", err);
        return response.sendResponse(res, 500, "error", constants.messages.error.getData, err);
      })


  } catch (e) {
    logger.error("getUserBasicInfo ", e);
    return response.sendResponse(res, 500, "error", constants.messages.error.getData, err);
  }
}

exports.deleteUser = function(req, res) {
  try {
    var query = {
      "_id": req.params.id
    }
    delete req.body['_id'];
    userModel.findOneAndUpdate(query, {
      "isDelete": true
    }, {
      "new": true
    }, function(err, data) {
      if (err) {
        logger.error("deleteUser  " + err);
        response.sendResponse(res, 500, "error", constants.messages.error.deleteRole, err);
      } else
        response.sendResponse(res, 200, "success", constants.messages.success.deleteRole);
    })

  } catch (e) {
    logger.error("deleteUser  " + err);
  }
}

exports.changePassword = function(req, res) {
  try {
    console.log("inside change passowrd  ");
    component.utility.validateNull(req, res, "body", "oldPassword", "newPassword");
    console.log(">>>>>>>>>> change passowrd  ");
    userModel.findOne({
      "username": req.user._doc.username
    }).populate('role').exec(function(err, user) {
      if (err) {
        logger.error("changePassword  " + err);
        return response.sendResponse(res, 402, "error", constants.messages.error.changePassword, err);
      }
      if (!user) {
        return response.sendResponse(res, 401, "error", constants.messages.error.changePassword, err);
      }
      passwordHash(req.body.oldPassword).verifyAgainst(user.password, function(error, verified) {
        console.log("after verification ", error, user);
        if (error) {
          // db error
          logger.error("changePassword  " + error);
          response.sendResponse(res, 500, "error", constants.messages.error.changePassword, err);
        } else if (!verified) {
          // password not matched
          response.sendResponse(res, 401, "error", constants.messages.error.changePassword);
        } else {
          // update new password
          password(req.body.newPassword).hash(function(error, hash) {
            userModel.findByIdAndUpdate(user._id, {
              $set: {
                password: hash
              }
            }, {
              new: true
            }, function(err, user) {
              if (err) {
                logger.error("changePassword  " + error);
                response.sendResponse(res, 500, "error", constants.messages.error.changePassword, err);
              } else {
                response.sendResponse(res, 200, "success", constants.messages.success.changePassword);
              }
            });

          })
        }
      })
    });

  } catch (e) {
    logger.error("changePassword  " + e);
  }
}

exports.forgotPassword = function(req, res) {
  try {

    if (!req.body.email) {
      return response.sendResponse(res, 400, "error", constants.statusCode['400']);
    } else {
      models.userModel.find({
          email: req.body.email
        }).exec()
        .then(function(user) {
          console.log(user);
          if (!user.length) {
            // no data found.
            return response.sendResponse(res, 402, "warning", constants.messages.error.emailNotFound);
          } else {
            // get the random PASSOWORD
            var alphaNumeric = utility.getAlphaNumeric();
            password(alphaNumeric).hash(function(error, hash) {
              if (error) {
                logger.error("forgotPassword  " + error);
                return response.sendResponse(res, 500, "error", constants.messages.error.saveData);
              } else {
                // saving user password with random password
                var query = {
                  email: req.body.email
                }
                var update = {
                  password: hash
                }
                var option = {
                  new: true
                }
                models.userModel.findOneAndUpdate(query, update, option, function(error, user) {
                  if (error) {
                    logger.error("forgotPassword  " + error);
                    return response.sendResponse(res, 500, "error", constants.messages.error.saveData);
                  } else {

                    // sending email verification
                    var data = {
                      templateType: "forgot_password",

                      email: user.email,
                      mobile: user.mobile,
                      name: user.firstName && user.lastName ? user.firstName + " " + user.lastName : user.email.split("@")[0],
                      company: constants.companyDetails.name,
                      password: alphaNumeric
                    }
                    console.log('data >>>>>>>>', data);
                    utility.sendVerificationMail(data, function(err, success) {
                      if (err) {
                        logger.error("forgotPassword  " + err);
                        LOG.error("mail error send  error" + err);
                        return response.sendResponse(res, 500, "error", constants.messages.error.mailSend);
                        // return response.sendResponse(res, 500, "error", constants.messages.error.forgetPasswordFailed, err);
                      } else {
                        LOG.info("mail error send  success");
                        return response.sendResponse(res, 200, "success", constants.messages.success.mailSend);
                        // return response.sendResponse(res, 200, "success", constants.messages.success.verificationMailSent);
                      }
                    })
                  }
                })
              }
            })
          }
        })
        .catch(function(error) {
          logger.error("forgotPassword  " + error);
          return response.sendResponse(res, 500, "error", constants.messages.error.saveData, error);
        })
    }
  } catch (e) {
    logger.error("forgotPassword  " + e);
  }
}


exports.resetPassword = function(req, res) {
  try {
    console.log("calling reset password");
    // making encrypt password
    password(req.body.password).hash(function(error, hash) {
      req.body.password = hash;
      var query = {
        username : req.body.username
      },
      updateData = {
        password : req.body.password
      },
      option = {
        new:true,
        multi:true
      };
      console.log(query,updateData);
       models.userModel.update(query,updateData,option,function(err,user) {
        if(err) {
          return response.sendResponse(res, 500, "error", constants.messages.error.saveData, error);
        }
        console.log(user);
        if(!user.nModified) {
          // no user found
          logger.error("no user found");
          return response.sendResponse(res, 402, "error",constants.messages.error.dataNotFound);
        }
        else{
          return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
        }
      });
    })
  }
  catch(err) {
    return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
  }

}

/**
 * functionName :verifyEmail
 * Info : Used to reset passowrd verify mail and activate password encryption
 * input :email
 */
exports.verifyEmail = function(req, res) {
  try {
    var userData;
    models.userModel.find({email:req.params.email}).exec()
    .then(function(user) {
      if(!user.length) {
        return response.sendResponse(res, 402, "error", constants.messages.error.invalidEmail);
      }
      userData = user[0]
      // generate resetPassword token
      password(user.username+new Date()).hash(function(error, hash) {
        var query = {
          username:userData.username
        },
        update = {
          resetPasswordToken:hash
        },
        option = {
          new:true,
          multi:true
        };
        models.userModel.findOneAndUpdate(query,update,option,function(err,user) {
          // send mail with the token
          var userObj = {
            name:user.firstName,
            email: user.email,
            resetPasswordToken : user.resetPasswordToken
          }

          utility.sendVerificationMail(userObj,function(err,data) {
            if(err) {
              console.error(err);
              return response.sendResponse(res, 402, "error", err);
            }
            else{
              return response.sendResponse(res, 200, "success", constants.messages.success.resetPasswordMailSent);
            }
          })

        })
      })

    })
    .catch(function(err) {
        return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
    })
  }
  catch(err) {
    return response.sendResponse(res, 500, "error", constants.messages.error.saveData, err);
  }

}

exports.resetPasswordByToken = function(req, res) {
  if(!req.body.resetPasswordToken || !req.body.password){
    return response.sendResponse(res, 402, "error", constants.messages.error.invalidInput);
  }
  password(req.body.password).hash(function(error, hash) {
    var query = {
      resetPasswordToken: req.body.resetPasswordToken,
    },
    update = {
      resetPasswordToken : null,
      password:hash
    },
    option = {
      new:true,
    };
    // models.userModel.find(query).exec()
    // .then(function(user) {
    //   return response.sendResponse(res, 200, "success", constants.messages.success.saveData,user);
    // })
    models.userModel.findOneAndUpdate(query,update,option,function(err,user) {
      console.log("update passowrd ",user);
      return response.sendResponse(res, 200, "success", constants.messages.success.saveData);
    })
  })

}
