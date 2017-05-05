/*global angular */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .service('userService', ['$http', '$q', function ($http, $q) {

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

    this.getPage = function (skip, limit) {
      var promise = $http({
        method: 'GET',
        url: _this.baseUrl,
        params: {skip: skip, limit: limit},
        withCredentials: true
      });
      return promise.then(function (response) {
        console.log("Response Gotten>>", response);
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

