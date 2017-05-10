/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.config', [])
  .service('configService', [ '$http', function ($http) {

    var URL = 'api/config';
    this.get =  function () {

      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {
        return response;
      }, function(err) {
        return err;
      });
    };

  }])
