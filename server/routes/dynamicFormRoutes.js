const express = require('express'),
  path = require('path'),
  router = express.Router(),
  controllers = require("./../controllers/index");

router.post('/', (req, res, next)=> {
  controllers.dynamicFormCtrl.addDynamicForm(req, res);
});
router.get('/', (req, res, next)=> {
  controllers.dynamicFormCtrl.getDynamicForm(req, res);
});

router.put('/', function (req, res, next) {
  controllers.dynamicFormCtrl.updateDynamicForm(req, res);
});


/*router.delete('/:id', function(req, res, next) {
  controllers.dynamicFormCtrl.deleteConfig(req, res);
});*/

module.exports = router;
