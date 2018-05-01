const express = require('express');
const router = express.Router();
const {qmr14Ctrl:{saveData}} = require("./../controllers/index");
router.post('/',saveData);

module.exports = router;
