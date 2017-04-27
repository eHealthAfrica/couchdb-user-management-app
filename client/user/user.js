/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.user', ['ngRoute', 'ng.simple.table']);

angular.module('app.user').config(['$routeProvider',  function($routeProvider) {
    $routeProvider.when('/users/list', {
      templateUrl: 'user/partials/list.html',
      controller: 'UserCtrl',
      resolve: {
        users: ['userService', function (userService) {
          return userService.getAll().then(function (resp) {
            resp.forEach(function (elem) {
              if (elem.lomis_stock){
                if (_.isEmpty(elem.lomis_stock.mobile)){ elem.user_type = 'Dashboard';}
                else{ elem.user_type = 'Mobile';}
              }
            });
            return resp;
          }).catch(function (err) {console.log(err); return [];});
        }],
        selectedUser: function(){ return null; }
      }
    }).when('/users/create', {
      templateUrl: 'user/partials/create.html',
      controller: 'UserCtrl',
      resolve:{
        users: function(){ return [];},
        selectedUser: function(){ return null;}
      }
    }).when('/users/edit/:id', {
      templateUrl: 'user/partials/edit.html',
      controller: 'UserCtrl',
      resolve:{
        users: function(){ return [];},
        selectedUser:['userService', '$route', function(userService, $route){
          return userService.getOne($route.current.params.id).then(function (resp){  return resp; }).catch(function (err) {console.log(err); return null;});
        }]
      }
    }).when('/users/view/:id', {
      templateUrl: 'user/partials/view.html',
      controller: 'UserCtrl',
      resolve:{
        users: function(){ return [];},
        selectedUser:['userService','$route',function(userService, $route){
          return userService.getOne($route.current.params.id).then(function (resp){  return resp; }).catch(function (err) {console.log(err); return null;});
        }]
      }
    }).when('/users/delete/:id', {
      templateUrl: 'user/partials/delete.html',
      controller: 'UserCtrl',
      resolve:{
        users: function(){ return [];},
        selectedUser: ['userService', '$route', function(userService, $route){
          return userService.getOne($route.current.params.id).then(function (resp){  return resp; }).catch(function (err) {console.log(err); return null;});
        }]
      }
    });
  }]);