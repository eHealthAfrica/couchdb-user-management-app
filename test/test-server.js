
var express = require('express')
var bodyParser = require('body-parser')
var http = require('http')

var config = require('./config/index')
var umsApp = require('../app/server/app')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', umsApp(config))

var server = http.createServer(app)
server.listen(config.port, function () {
  console.log('UMS server running on http://localhost:' + config.testPort)
})

module.exports = app
