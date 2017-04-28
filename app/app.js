/* global require */
/* global module */
'use strict';

var express = require('express');
var cradle = require('cradle');
var http =  require('http');

module.exports = function(couchConfig) {
  var app = express();
  cradle.setup(couchConfig);
  require('./routes')(app);
  return app;
};


