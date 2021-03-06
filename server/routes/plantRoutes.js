var express = require('express');
var path = require('path');
var router = express.Router();
var controllers = require("./../controllers/index");
router.post('/',function(req, res, next) {
  controllers.plantCtrl.addPlant(req, res);
});
router.get('/', function(req, res, next) {
  controllers.plantCtrl.getPlant(req, res);
});
router.put('/', function(req, res, next) {
  controllers.plantCtrl.udpatePlant(req, res);
});


/*router.delete('/:id', function(req, res, next) {
  controllers.plantCtrl.deleteConfig(req, res);
});*/

module.exports = router;
