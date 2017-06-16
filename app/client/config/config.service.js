/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.config', [])
  .service('Config', [ '$http', function ($http) {

    var _this =  this;
    this.url = 'api/config';
    this.config =  null;


    this.get =  function () {
      if (_this.config !== null) { return _this.config;}

      var promise = $http({
        url: _this.url,
        withCredentials: true
      });
      return promise.then(function (response) {
        _this.config = response.data;
        return response.data;
      }, function (err) {
        console.log(err);
        return err;
      });
    };



  }])
