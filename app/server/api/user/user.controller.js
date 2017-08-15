/* global exports */
/* global require */
'use strict';

var User = require('./user.model.js');

exports.create = create;
exports.fetchPaged = fetchPaged;
exports.fetchOne = fetchOne;
exports.update = update;
exports.remove = remove;
exports.search =  search;



function create (req, res, next) {
  User.create(req.body, function(err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
}


function search (req, res, next) {
  User.search(
    parseInt(req.query.skip),
    parseInt(req.query.limit),
    req.query.sortBy,
    req.query.sortDirection,
    req.params.searchString,
    function (err, searchResult) {
      if (err) {
        return next(err);
      }
      res.json(searchResult);
    }
  )
}



function fetchOne (req, res, next) {
  User.findByName(req.params.name, function(err, user){
    if (err){
      if (err.name && err.name === 'CouchError' && err.error === 'not_found'){
        return next({name: 'RecordNotFound', errors: {name:req.params.name}});
      }
      return next(err);
    }

    res.json(user);
  }, true);
}

function fetchPaged (req, res, next) {
  console.log("got filters", req.filters);
  User.fetchPaged(parseInt(req.query.skip), parseInt(req.query.limit), req.query.sortBy, req.query.sortDirection, function (err, users) {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
}

function update (req, res, next) {
  User.update(req.params.name, req.body, function(err, user) {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
}


function remove (req, res, next) {
  User.remove(req.params.name, function (err, rsp) {
    if (err) {
      return next(err);
    }

    res.json(rsp);
  });
}
