/* jshint node: true */
/* global angular */
'use strict';


angular.module('myApp', [
  'app.user',
  'app.role',
  'app.config',
  'ngRoute',
  'ngCookies'
])
  .factory('authInterceptor', [ '$rootScope', '$q', '$cookies', '$window' ,function($rootScope, $q, $cookies, $window) {
    return {
      //TODO modify to be more generic
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer '.concat($cookies.getObject('token'));
        } else {
           $window.location.href = '/login';
        }
        return config;
      },

      responseError: function(response) {
        if (response.status === 401) {
          $rootScope.$emit('unauthorized');
          $cookies.remove('token');
          $window.location.href = '/login';
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  }])
  .config(['$locationProvider', '$routeProvider','$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('!');
    $httpProvider.interceptors.push('authInterceptor');
    $routeProvider.otherwise({redirectTo: '/users/list'});
  }]);
