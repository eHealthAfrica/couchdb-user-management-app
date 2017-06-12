var express =  require('express');

module.exports = function(app) {

  app.use('/api/users', require('./api/user/index'));
  app.use('/', express.static(__dirname + '/../client/'));


  app.use(function(err, req, res, next) {
    switch (err.name) {
      case 'UnauthorizedError':
        return res.send(401);
        break;
      case 'ValidationError':
        return res.status(400).json(err);
        break;
      case 'RecordNotFound':
        return res.status(404).json(err);
        break;
    }
    res.send(500);
  });

}

