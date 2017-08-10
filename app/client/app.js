/* jshint node: true */
/* global angular */
'use strict'

angular.module('myApp', [
  'app.auth',
  'app.config',
  'app.navbar',
  'app.role',
  'app.user',
  'app.utility',
  'ngCookies',
  'ngRoute',
  'ui.bootstrap'
])
  .factory('authInterceptor', ['$q', '$rootScope', 'SharedAuth', function ($q, $rootScope, SharedAuth) {
    return {

      request: function (config) {
        if ($rootScope.loggedIn) {
          config.headers = config.headers || {}
          if (SharedAuth.isLoggedIn()) {
            SharedAuth.decorateHeader(config.headers)
          }
        }
        return config
      },

      responseError: function (response) {
        if (response.status === 401) {
          SharedAuth.logOut()
          return $q.reject(response)
        } else {
          return $q.reject(response)
        }
      }

    }
  }])
  .config(['$locationProvider', '$routeProvider', '$httpProvider', function ($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('!')
    $httpProvider.interceptors.push('authInterceptor')
    $routeProvider.otherwise({redirectTo: '/users/list'})
  }])
  .run(['$rootScope', '$route', 'Auth', 'Config', 'Shared', 'SharedAuth', function ($rootScope, $route, Auth, Config, Shared, SharedAuth) {
    $rootScope.authenticated = false
    Config.get()
       .then(function (response) {
         Shared.setConfig(response)
         if (SharedAuth.isLoggedIn()) {
           $rootScope.loggedIn = true
           Auth.getCurrentUser()
             .then(function (response) {
               $rootScope.authenticated = Auth.isAuthorized()
               if ($rootScope.authenticated) {
                 $route.reload()
               }
             })
         }
       })
  }])
