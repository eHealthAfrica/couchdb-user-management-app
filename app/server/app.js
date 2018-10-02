/* global require */
/* global module */
'use strict';

var express = require('express');
var cradle = require('cradle');
var bootstrap =  require('couchdb-bootstrap');
var path =  require('path');
var _ =  require('lodash');

module.exports = function(config) {
  var app = express();
  app.set('CONFIG', _.omit(config, ['couch']));

  var dbURL = 'http://' + config.couch.auth.username + ':' +  config.couch.auth.password + "@" + config.couch.host.replace('http://', '') + ':' + config.couch.port;

  bootstrap(dbURL, path.resolve('./node_modules/couchdb-user-management-app/couchdb'), function(error, response) {
   if (error){  console.log(error); }
  });

  config.couch.raw  = true;
  cradle.setup(config.couch);

  app.use(function (req, res, next) {
    req.filters = config.filters || [];
    next();
  })

  require('./routes')(app);
  return app;
};
