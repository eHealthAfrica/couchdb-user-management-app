/*global angular */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .service('usersDependencyService', ['$http', '$q', function ($http, $q) {


      this.methods = {}


      this.get = function (resource, param) {
        //alert(resource);
        if (this.methods[resource]){
          return this.methods[resource](param);
        }
        else {
          alert("qq");
          return null;
        }

      }



  }]);
