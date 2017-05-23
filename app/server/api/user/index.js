'use strict';

var express = require('express');
var controller = require('./user.controller.js');

var router = express.Router();

router.get('/',  controller.fetchPaged);
router.post('/',  controller.create);
router.get('/search/:searchString', controller.search);
router.get('/:name',  controller.fetchOne);
router.put('/:name', controller.update);
router.delete('/:name', controller.remove);
module.exports = router;
