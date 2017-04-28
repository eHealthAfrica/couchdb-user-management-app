'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/',  controller.all);
router.post('/',  controller.create);
router.get('/:name',  controller.fetchOne);
router.put('/:name', controller.update);
router.delete('/:name', controller.delete);
module.exports = router;
