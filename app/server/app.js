/* global require */
/* global module */
'use strict';

var express = require('express');
var cradle = require('cradle');
var http =  require('http');

module.exports = function(couchConfig) {
  var app = express();
  couchConfig.raw  = true;
  cradle.setup(couchConfig);
  require('./routes')(app);
  return app;
};


