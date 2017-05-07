/* global require */
/* global module */
'use strict';

var express = require('express');
var cradle = require('cradle');
var http =  require('http');
var bootstrap =  require('couchdb-bootstrap');

module.exports = function(couchConfig) {
  var app = express();
  couchConfig.raw  = true;
  cradle.setup(couchConfig);

  var dbURL = 'http://' + couchConfig.auth.username + ':' +  couchConfig.auth.password + "@" + couchConfig.host.replace('http://', '') + ':' + couchConfig.port;

  bootstrap(dbURL, '../couchdb', function(error, response) {
   if (error){  console.log(error); }
  });

  require('./routes')(app);
  return app;
};


