
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var bootstrap =  require('couchdb-bootstrap');

var cradle = require('cradle');
var config =  require('./../app/config/index');
var ums_app = require('../app/server/app');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var couchConfig =  config.couch;
var dbURL = 'http://' + couchConfig.auth.username + ':' +  couchConfig.auth.password + "@" + couchConfig.host.replace('http://', '') + ':' + couchConfig.port;

bootstrap(dbURL, '../couchdb', function(error, response) {
  if (error){  console.log(error); }
});
app.use('/', ums_app(couchConfig));

var server   = http.createServer(app);
server.listen(config.port, function() {
  console.log("UMS server running on http://localhost:" +  config.port);
});

module.exports = app;
