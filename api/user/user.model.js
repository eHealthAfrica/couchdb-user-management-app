'use strict';

var q = require('q');
var lodash = require('lodash');
var logger = require('winston');
var cradle = require('cradle');
var crypto = require('crypto');
var utility = require('../../components/utility');
var errors = require('../../components/errors');

var db = new (cradle.Connection)().database('_users');

// use promises for caching across all requests
var allPromise = null;

// clear cache on db changes
db.changes().on('change', function() {
  db.cache.purge();
  allPromise = null;
});

// exports
exports.db = db;
exports.id = id;
exports.create = create;
exports.remove = remove;
exports.all = all;
exports.findById = findById;
exports.findByName = findByName;
exports.update =  update;

function id(name) {
  return 'org.couchdb.user:' + name;
}

function exists(name, cb) {
  findByName(name, function(err, user) {
    if (err) {
      if (err.error === 'not_found') {
        return cb(null, false);
      } else {
        return cb(err);
      }
    }

    cb(null, true, user);
  });
}

function create(data, cb) {
  var error = new errors.ValidationError();

  data = data || {};

  var name = String.prototype.trim.apply(data.name || '').toLowerCase();

  if (!name) {
    error.required('name');
  }
  if (!data.password && !data.password_scheme) {
    error.required('password');
  }

  if (error.length) {
    return cb(error);
  }

  exists(name, function(err, exists) {
    if (err) {
      return cb(err);
    }
    if (exists) {
      error.unique('name');
      return cb(error);
    }

    var user = {
      name: name,
      password: data.password,
      type: 'user',
      roles: data.roles || [],
      email: data.email || ''
     // access: data.access || {}
    };

    db.save(id(name), user, function(err, res) {
      if (err) {
        return cb(err);
      }

      db.cache.purge(res.id);

      user._id = res.id;
      user._rev = res.rev;
      cb(null,user);
    });
  });
}

function remove(name, cb) {
  exists(name, function(err, exists, user) {
    if (err) {
      return cb(err);
    }
    if (!exists) {
      return cb({name: 'RecordNotFound', errors: {name: name}});
    }

    db.remove(user._id, user._rev, cb);
  });
}

function all(cb) {
  if (!allPromise) {
    var d = q.defer();
    allPromise = d.promise;

    db.all({include_docs: true}, function(err, rows) {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(
          utility
            .removeDesignDocs(rows.toArray())
            .map(function (row) {
              return row;
            })
        );
      }
    });
  }

  allPromise
    .then(function(rows) {
      cb(null, rows);
    })
    .catch(function(err) {
      allPromise = null;
      cb(err);
    })
}

function findById(id, cb, auth) {
  db.get(id, function(err, user) {
   if (err) {

      return cb(err);
    }

    cb(null, user);
  });
}

function findByName(name, cb, auth) {
  findById(id(name), cb, auth);
}




function update(name, data, cb) {
  exists(name, function(err, exists, user) {
    if (err) {
      return cb(err);
    }
    if (!exists) {
      return cb({name: 'RecordNotFound', errors: {name: name}});
    }
    db.merge(user._id, data , cb);
  });
}



