/* global angular */
/* jshint node: true */
'use strict'

angular.module('app.role', ['ngRoute', 'app.user'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/users/:id/role/edit', {
      templateUrl: 'app/role/partials/edit.html',
      controller: 'RoleCtrl',
      controllerAs: 'ctrl',
      resolve: {
        user: ['userService', '$route', function (userService, $route) {
          return userService.getOne($route.current.params.id).then(function (resp) { return resp }).catch(function (err) { console.log(err); return null })
        }],
        adminLevels: ['adminLevelService', function (adminLevelService) {
          return adminLevelService.getAll().then(function (data) { return data }).catch(function (err) { console.log(err); return [] })
        }],
        locations: ['locationService', function (locationService) {
          return locationService.getAll().then(function (data) { return data }).catch(function (err) { console.log(err); return [] })
        }],
        facilities: ['facilityService', function (facilityService) {
          return facilityService.getAll().then(function (data) { return data }).catch(function (err) { console.log(err); return [] })
        }],
        programs: ['programService', function (programService) {
          return programService.getAll().then(function (data) { return data }).catch(function (err) { console.log(err); return [] })
        }],
        facilityPrograms: ['facilityProgramsService', function (facilityProgramsService) {
          return facilityProgramsService.getAll().then(function (data) { return data }).catch(function (err) { console.log(err); return [] })
        }]
      }
    })
  }])
