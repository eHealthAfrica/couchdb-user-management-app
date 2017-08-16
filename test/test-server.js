
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var bootstrap =  require('couchdb-bootstrap');

var cradle = require('cradle');
var config =  require('./config/index');
var ums_app = require('../app/server/app');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

config.filters = [];
app.use(function (req, res, next) {
  req.filters = [];
  req.filterParams = {};
  next();
})
app.use('/', ums_app(config));

var server   = http.createServer(app);
server.listen(config.port, function() {
  console.log("UMS server running on http://localhost:" +  config.testPort);
});

module.exports = app;
