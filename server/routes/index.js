var express = require('express');
var path = require('path');
var router = express.Router();
// var testRoutes = require('./testRoutes');
var roleRoutes  = require('./roleRoutes');
var userRoutes  = require('./userRoutes');
var configRoutes = require('./configRoutes');
var plantRoutes  = require('./plantRoutes');
var constantsRoutes  = require('./constantsRoutes');
var productRoutes = require('./productRoutes');
var supplierRoutes = require('./supplierRoutes');
var brokerRoutes = require('./brokerRoutes');
var rawMaterialRoutes = require('./rawMaterialRoutes');
var recordRoutes = require('./recordRoutes');
var dynamicFormRoutes = require('./dynamicFormRoutes');
var genericMasterRoutes = require('./genericMasterRoutes');
const qmr14Routes = require('./qmr14Routes');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // var db = require('./server/db.js');
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/status', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.status(200).send({status:"ok"});
});
// router.use('/test', testRoutes);
router.use('/role', roleRoutes);
router.use('/user', userRoutes);
router.use('/config', configRoutes);
router.use('/plant', plantRoutes);
router.use('/product', productRoutes);
router.use('/constant', constantsRoutes);
router.use('/supplier', supplierRoutes);
router.use('/broker', brokerRoutes);
router.use('/rawMaterial', rawMaterialRoutes);
router.use('/record', recordRoutes);
router.use('/dynamicForm', dynamicFormRoutes);
router.use('/genericMaster', genericMasterRoutes);
router.use('/qmr14', qmr14Routes);
// router.use('/vle', vleRoutes);
router.get('/test/:val1/:val2', function(req,res) {
  console.log("req.query   ",req.query);
  console.log("req.param   ",req.params);
  res.send({status:"ok"});
});

module.exports = router;
