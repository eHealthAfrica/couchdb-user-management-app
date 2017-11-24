/*global angular */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .service('userService', ['$http', 'Auth','Shared', function ($http, Auth, Shared) {

    var _this =  this;
    this.baseUrl = 'api/users';
    this.singleRecordKey = 'name';

    this.setBaseUrl =  function (url) {
      _this.baseUrl = url.replace(/\/$/, '');
    };

    this.setSingleRecordKey = function (key) {
      _this.singleRecordKey =  key;
    };

    this.getSingleRecordKey = function () {
      return _this.singleRecordKey;
    };

    this.getPage = function (skip, limit, sortBy, sortDirection) {

      var filterParams = {};
      var config =  Shared.getConfig();
      if (config.filters.length > 0) {
        _.forEach(config.filters, function (filter) {
          if (filter.hasOwnProperty('field')){
            filterParams[filter.field.id] =  Auth.getCurrentUser()[filter.field.id] || filter.field.default;
          }
        });
      }

      if (! limit) { limit =  30;}
      if (! sortBy) { sortBy = 'name'; }
      if (! sortDirection) { sortDirection = 'asc'; }

      var promise = $http({
        method: 'GET',
        url: _this.baseUrl,
        params: {skip: skip, limit: limit, sortBy: sortBy, sortDirection:  sortDirection, filterParams: filterParams,},
        withCredentials: true
      });
      return promise.then(function (response) {
        return response.data;
      }, function(err) {
        return err;
      });
    };

    this.getOne =  function (name) {
      var promise = $http({
        url: _this.baseUrl + '/'+  name,
        withCredentials: true
      });
      return promise.then(function (response) {
        return response.data;
      });
    };

    this.search = function (skip, limit, sortBy, sortDirection, searchString) {

      var filterParams = {};
      var config =  Shared.getConfig();
      if (config.filters.length > 0) {
        _.forEach(config.filters, function (filter) {
          if (filter.hasOwnProperty('field')){
            filterParams[filter.field.id] =  Auth.getCurrentUser()[filter.field.id] || filter.field.default;
          }
        });
      }

      if (! sortBy) { sortBy = 'name'; }
      if (! sortDirection) { sortDirection = 'asc'; }

      var promise =  $http({
        url: _this.baseUrl + '/search/' + searchString,
        params: {skip: skip, limit: limit, sortBy: sortBy, sortDirection:  sortDirection, filterParams: filterParams,},
        withCredentials: true
      });
      return promise.then(function (response) {
        return response.data;
      });
    };

    this.create = function (user) {
      user._id =  'org.couchdb.user:'+ user.name;
      var promise = $http({
        method: 'POST',
        url: _this.baseUrl,
        data: user,
        withCredentials: true
      });
      return promise.then(function () {
        delete user.password;
        return user;
      });
    };

    this.update = function (update) {
      var config =  Shared.getConfig();
      var workSpace = config.usersTable.workSpace || 'umsWorkspace';
      update = _.omit(update, workSpace);


      return $http({
        method: 'PUT',
        url: _this.baseUrl + '/' +  update[_this.singleRecordKey],
        withCredentials: true,
        data: update
      }).then(function(response) {
        return response;
      });
    };

    this.delete = function (id) {

      return $http({
        method: 'DELETE',
        url: _this.baseUrl + '/' +  id,
        withCredentials: true
      }).then(function(response) {
        return response;
      });
    };
  }]);

