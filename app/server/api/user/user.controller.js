'use strict';

var User = require('./user.model.js');

/**
 * Get all users
 */
exports.all = function(req, res, next) {
  User.all(function(err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
};

/**
 * Create a user
 */
exports.create = function(req, res, next) {
  User.create(req.body, function(err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
};

exports.fetchOne = function (req, res, next) {
  User.findByName(req.params.name, function(err, user){
    if (err){
      if (err.name && err.name === 'CouchError' && err.error === 'not_found'){
        return next({name: 'RecordNotFound', errors: {name:req.params.name}});
      }
;      return next(err);
    }

    res.json(user);
  }, true);
};


exports.update = function (req, res, next) {
  User.update(req.params.name, req.body, function(err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
};



exports.delete = function (req, res, next) {
  User.remove(req.params.name, function (err, rsp) {
    if (err) {
      return next(err);
    }

    res.json(rsp);
  });
};
