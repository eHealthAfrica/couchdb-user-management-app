/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.user', ['ngRoute', 'ng.simple.table', 'ng.simple.pagination' ,'app.role']);

angular.module('app.user').config(['$routeProvider',  function($routeProvider) {
  $routeProvider
    .when('/users/list', {
      templateUrl: 'user/partials/list.html',
      controller: 'UsersCtrl',
      controllerAs: 'ctrl',
      resolve: {
        users: ['userService', 'PAGE_SIZE', function (userService, PAGE_SIZE) {
          return userService.getPage(0, PAGE_SIZE)
            .then(function (resp) { return resp;  })
            .catch(function (err) { console.log(err); return []; });
        }]
      }

    })
    .when('/users/create', {
      templateUrl: 'user/partials/create.html',
      controller: 'NewUserCtrl',
      controllerAs: 'ctrl'
    })
    .when('/users/edit/:id', {
      templateUrl: 'user/partials/edit.html',
      controller: 'UserCtrl',
      controllerAs: 'ctrl',
      resolve:{
      user:['userService', '$route', function (userService, $route) {
        return userService.getOne($route.current.params.id)
          .then (function (resp){
            return resp;
          })
          .catch (function (err) {
            console.log(err);
            return null;
          });
      }]
    }
    })
    .when('/users/view/:id', {
      templateUrl: 'user/partials/view.html',
      controller: 'UserCtrl',
      controllerAs: 'ctrl',
      resolve: {
        user: ['userService', '$route', function (userService, $route) {
          return userService.getOne($route.current.params.id)
            .then(function (resp) {
              return resp;
            })
            .catch(function (err) {
              console.log(err);
              return null;
            });
        }]
      }
    })
    .when('/users/delete/:id', {
      templateUrl: 'user/partials/delete.html',
      controller: 'UserCtrl',
      controllerAs: 'ctrl',
      resolve:{
      user: ['userService', '$route', function (userService, $route) {
        return userService.getOne($route.current.params.id)
          .then(function (resp){
            return resp;
          })
          .catch(function (err) {
            console.log(err);
            return null;
          });
      }]
    }
  });
}]);
