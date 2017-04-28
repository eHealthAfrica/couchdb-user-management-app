
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');

var cradle = require('cradle');
var config =  require('./config/index');
var ums_app = require('./app');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', ums_app(config.couch));

var server   = http.createServer(app);
server.listen(config.port, function() {
  console.log("UMS server running on http://localhost:" +  config.port);
});

module.exports = app;