/* global require */
/* global module */
'use strict';

var express = require('express');
var cradle = require('cradle');
var bootstrap =  require('couchdb-bootstrap');
var path =  require('path');

module.exports = function(couchConfig) {
  var app = express();

  var dbURL = 'http://' + couchConfig.auth.username + ':' +  couchConfig.auth.password + "@" + couchConfig.host.replace('http://', '') + ':' + couchConfig.port;

  bootstrap(dbURL, path.resolve('./node_modules/couchdb-user-management-app/couchdb'), function(error, response) {
   if (error){  console.log(error); }
  });

  couchConfig.raw  = true;
  cradle.setup(couchConfig);
  require('./routes')(app);
  return app;
};


