/*global angular */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .service('usersDependencyService',  function () {

      this.methods = {}

      this.get = function (resource, param) {
        if (this.methods[resource]){
          return this.methods[resource](param);
        }
        else {
          return null;
        }
      }
  });
