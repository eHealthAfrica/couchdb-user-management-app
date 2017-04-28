/* jshint node: true */
/* global angular */
'use strict';


angular.module('myApp', [

  'app.user',
  'app.role',
  'config',
  'ngRoute'

]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/users/list'});
}]);
