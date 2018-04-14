var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
var passport = require("passport");
var config = require("config");
var fs = require('fs');
// multer configuration starts
var multer = require('multer');
var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {

    // creating dynamic folder
    if (!fs.existsSync(config.get(config.get("env")+".uploadPath") ) ) { // upload folder
        fs.mkdirSync(config.get(config.get("env")+".uploadPath"));
    }
    // sample collection folder
    if (!fs.existsSync(config.get(config.get("env")+".uploadPath")+"/sampleCollection" ) ) { // upload folder
        fs.mkdirSync(config.get(config.get("env")+".uploadPath")+"/sampleCollection" );
    }
    // upload starts here
    if(req.path.indexOf("sampleCollection") != -1){
      cb(null, config.get(config.get("env")+".uploadPath")+"/sampleCollection" )
    }
    else{

      cb(null, config.get(config.get("env")+".uploadPath") ) // document upload
    }
  },
  filename: function (req, file, cb) {
    // console.log("req  ",req);
    console.log("req  body ",req.body);
    if(req.path.indexOf("sampleCollection") != -1){
      cb(null,file.originalname); // for sample collection keep the original name
    }
    else{
      cb(null, (req.query.po || new Date() )+"_"+file.originalname);
    }
  }
});
var upload = multer({ storage: storage });
// multer configuration ends

router.post('/',function(req, res, next) {
  controllers.recordCtrl.addRecord(req, res);
});
router.get('/', function(req, res, next) {

  controllers.recordCtrl.getRecord(req, res);
});

router.get('/search/:search', function(req, res, next) {

  controllers.recordCtrl.getSearch(req, res);
});

router.put('/', function(req, res, next) {
  controllers.recordCtrl.udpateRecord(req, res);
});

router.post("/attachment", upload.any(), function (req, res) {
  console.log('files', req.files);
  controllers.recordCtrl.saveAttachments(req, res);
  //res.send(req.files);
});


// sample preparation
router.post('/samplePreparation', function(req, res, next) {
  controllers.recordCtrl.saveSamplePreparaion(req, res);
});
router.get('/samplePreparation/:record', function(req, res, next) {
  controllers.recordCtrl.getSamplePreparaion(req, res);
});
router.get('/samplePreparation/checkSupplierLot/:supplier/:lotNo/:rmGroupName', function(req, res, next) {
  controllers.recordCtrl.checkSupplierLot(req, res);
});
router.post('/sampleCollection2', function(req, res, next) {
  controllers.recordCtrl.saveSampleCollection2(req, res);
});
router.post('/sampleCollection', function(req, res, next) {
  controllers.recordCtrl.saveSampleCollection(req, res);
});
router.post('/sampleCollection/upload',upload.any(), function(req, res, next) {
  controllers.recordCtrl.uploadSampleCollection(req, res);
});
router.get('/sampleCollection/:record',function(req, res, next) {
  controllers.recordCtrl.getSampleCollection(req, res);
});

router.delete('/:id', function(req, res, next) {
  controllers.recordCtrl.deleteRecord(req, res);
});

module.exports = router;
