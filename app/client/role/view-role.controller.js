/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.role')
  .controller('ViewRoleCtrl', ['$scope', 'adminLevelService', 'facilityService', 'locationService', function($scope, adminLevelService, facilityService, locationService){

    var vm = this;
    vm.user =  null;
    vm.adminLevels = [];
    vm.locations = [];
    vm.facilities = [];

    vm.init =  function () {
      adminLevelService.getAll()
        .then (function (response) {
          vm.adminLevels = response;
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      facilityService.getAll()
        .then (function (response) {
          vm.facilities = response;
        })
        .catch(function (error) {
          console.log(error);
        });

      locationService.getAll()
        .then (function (response) {
          vm.locations =  response;
        })
        .catch (function (response) {
          console.log(error);
        });
    };

    vm.getRole = function () {
      vm.user =  $scope.$parent.ctrl.user;
      if (_.isEmpty(vm.user.lomis_stock.mobile) && _.isEmpty(vm.user.lomis_stock.dashboard)) { return 'None'; }
      else if (_.isEmpty(vm.user.lomis_stock.mobile)) { return 'Dashboard'; }
      else { return 'Mobile'; }
    };

    vm.getAdminLevel = function () {
      if ( vm.getRole() === 'Mobile' ){ return 'Facility'; }
      var id =  vm.user.lomis_stock.dashboard.access.level;

      for (var i in vm.adminLevels) {
        if (vm.adminLevels[i]._id === id) {
          return vm.adminLevels[i].name;
        }
      }
      return "Unknown Access Level";
    }

    vm.getLocations = function () {
      if ( vm.getRole() === 'Mobile' ) {
        var facilities =  vm.user.lomis_stock.mobile.facilities;
        var assignedFacilities = '';

        for (var i in facilities) {
          var facility =  Object.keys(facilities[i]);
          if (facility.length > 0) {
            for (var i in vm.facilities ) {
              if (vm.facilities[i]._id === facility[0]) {
                assignedFacilities += vm.facilities[i].name + ' ';
              }
            }
          }

        }
        return assignedFacilities;
      }
      else {
        var accessLevel =  vm.user.lomis_stock.dashboard.access.level;
        var accessItems = vm.user.lomis_stock.dashboard.access.items;
        var accessItem =  null;
        for (var i in accessItems) {
          if ( accessItems[i][accessLevel] ){
            accessItem =  accessItems[i][accessLevel];
            break;
          }
        }
        var assignedLocations = '';

        for (var i in accessItem) {
          for (var j in vm.locations) {
            if (vm.locations[j]._id === accessItem[i]) {
              assignedLocations += vm.locations[j].name;
            }
          }
        }

        return assignedLocations;



      }
    };

  }]);
