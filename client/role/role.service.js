/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.role')
.service('adminLevelService', [ '$http', function ($http) {

    var URL = '/api/admin_level';



  this.getAll =  function () {

    var promise = $http.get(  URL, {  withCredentials: true });
    return promise.then(function (response) {

      var sortedAdminLevel = [];
      for (var i in response.data){ if (response.data[i].parent === null){ sortedAdminLevel.push(response.data[i]);}}

      for (var k = 0; k < response.data.length; k++){
        var parId =  sortedAdminLevel[sortedAdminLevel.length -1]._id;
        for (var j in response.data){
          if (response.data[j].parent === parId){
            sortedAdminLevel.push(response.data[j]);
          }
        }
      }
      return sortedAdminLevel;
    }, function(err) {
      return err;
    });
  };

}])
  .service('facilityService', [ '$http', function ($http) {

    var URL = '/api/facilities';
    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {
        return response.data;
      }, function(err) {
        return err;
      });
    };
  }])
  .service('facilityProgramsService', [ '$http', function ($http) {

    var URL = '/api/common/facility-program';
    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {
        return response.data;
      }, function(err) {
        return err;
      });
    };
  }])
  .service('locationService', [ '$http', function ($http) {

    var URL = '/api/location';

    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {


        return response.data;
      }, function(err) {
        return err;
      });
    };



  }])
  .service('programService', [ '$http', function ($http) {

    var URL = '/api/program';

    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {


        return response.data;
      }, function(err) {
        return err;
      });
    };



  }]);