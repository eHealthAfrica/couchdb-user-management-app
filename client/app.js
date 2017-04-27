/* jshint node: true */
/* global angular */
'use strict';


angular.module('myApp', [

  'app.user',
  'app.role',
  'ngRoute'

]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

 // $locationProvider.html5Mode(true);
  //$routeProvider.otherwise({redirectTo: '/users/list'});
}]);
