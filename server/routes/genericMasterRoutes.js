const express = require('express'),
    path = require('path'),
    router = express.Router(),
    controllers = require("./../controllers/index");

router.post('/:model', (req, res, next) => {
    controllers.genericMasterCtrl.create(req, res);
});

router.get('/:model', (req, res, next) => {
    controllers.genericMasterCtrl.read(req, res);
});

router.put('/:model/:id', function (req, res, next) {
    controllers.genericMasterCtrl.update(req, res);
});

/*
router.delete('/:model/:id', function (req, res, next) {
    controllers.genericMasterCtrl.delete(req, res);
});
*/

router.post('/:model/search', (req, res, next) => {
    controllers.genericMasterCtrl.read(req, res);
});

module.exports = router;
