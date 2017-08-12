var express = require('express')
var path = require('path')

module.exports = function (app) {
  app.use('/api/config', function (req, res, next) {
    return res.json(app.get('CONFIG'))
  })
  app.use('/api/users', require('./api/user/index'))
  app.use('/', express.static(path.join(__dirname, '../client/')))


  app.use(function (err, req, res, next) {
    switch (err.name) {
      case 'UnauthorizedError':
        return res.send(401)
        break // eslint-disable-line
      case 'ValidationError':
        return res.status(400).json(err)
        break // eslint-disable-line
      case 'RecordNotFound':
        return res.status(404).json(err)
        break // eslint-disable-line
    }
    res.send(500)
  })
}
