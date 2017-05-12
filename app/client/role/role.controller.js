/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.role')
  .controller('RoleCtrl', ['$scope', '$location', 'userService','alertService', 'user', 'adminLevels', 'locations', 'facilities', 'programs', 'facilityPrograms', 'SETTINGS',  function($scope, $location, userService, alertService, user, adminLevels, locations, facilities, programs, facilityPrograms, SETTINGS){

    var vm = this;

    vm.user =  user;
    vm.userTypes =  SETTINGS.userTypes;
    vm.adminLevels =  adminLevels;
    vm.locations =  locations;
    vm.facilities =  facilities;
    vm.programs = programs;
    vm.facilityPrograms = facilityPrograms;

    $scope.$watch('vm.updateUserRoleForm.access.level', function (newValue, oldValue) {
      vm.getAssignedLocation();
    });


    vm.submitUpdateUserRoleForm = function () {
      if (vm.updateUserRoleForm.$error && !_.isEmpty(vm.updateUserRoleForm.$error)){
        return;
      }
      vm.updateUserRoleForm.lomis_stock = {};
      if (vm.updateUserRoleForm.type === vm.userTypes[0]) {
        vm.updateUserRoleForm.lomis_stock.mobile = {};
        var adminLevelIndex = -1;
        for(var i in vm.adminLevels){ if (vm.adminLevels[i]._id === vm.updateUserRoleForm.access.level){adminLevelIndex = i; break;}}

        vm.updateUserRoleForm.lomis_stock.dashboard = {access: {items:[], level: vm.updateUserRoleForm.access.level}};
        var item = {};
        item[vm.updateUserRoleForm.access.level] = [];
        item[vm.updateUserRoleForm.access.level].push(vm.updateUserRoleForm.locations[adminLevelIndex + ""]);
        vm.updateUserRoleForm.lomis_stock.dashboard.access.items.push(item);
      } else {
        vm.updateUserRoleForm.lomis_stock.dashboard = {};
        if (vm.updateUserRoleForm.facility){
          vm.updateUserRoleForm.lomis_stock.mobile = {};
          vm.updateUserRoleForm.lomis_stock.mobile.facilities = [];
          var entry = {};
          entry[vm.updateUserRoleForm.facility] = [vm.updateUserRoleForm.program];
          vm.updateUserRoleForm.lomis_stock.mobile.facilities.push( entry);
        }
      }
      userService.update({name : vm.user.name, _id: vm.user._id, lomis_stock:vm.updateUserRoleForm.lomis_stock}).then(function(response){
        alertService.showSuccessMessage("Changes successfully saved");
        var path =  'users/view/' + vm.user.name;
        $location.path(path);
      }).catch(function(err) {
        alertService.showErrorMessage('Entry was not updated' + err);
      });
    };

    vm.getAssignedLocation = function () {

      if (! vm.user.lomis_stock || (! vm.user.lomis_stock.mobile && ! vm.user.lomis_stock.dashboard)) {
        return;
      }

      if (vm.user.lomis_stock.mobile && ! _.isEmpty(vm.user.lomis_stock.mobile)) {
        var facility = vm.user.lomis_stock.mobile.facilities[0];
        vm.updateUserRoleForm.facility =  Object.keys(facility)[0];
        vm.updateUserRoleForm.program=  vm.user.lomis_stock.mobile.facilities[0][vm.updateUserRoleForm.facility][0];

      }
      else if (vm.user.lomis_stock.dashboard && ! _.isEmpty(vm.user.lomis_stock.dashboard)) {

        var accessLevel = vm.user.lomis_stock.dashboard.access.level;
        var accessItemId = vm.user.lomis_stock.dashboard.access.items[0][accessLevel][0];

        var accessItem = null;
        for (var i in vm.locations) {
          if (vm.locations[i]._id === accessItemId) {
            accessItem = vm.locations[i];
            break;
          }
        }

        var ancestors = _.orderBy(accessItem.ancestors, ['level'], ['asc']);
        vm.updateUserRoleForm.locations = [];

        for (var i in ancestors) {
          vm.updateUserRoleForm.locations[i] = ancestors[i]._id
        }
        vm.updateUserRoleForm.locations[ancestors.length] = accessItemId;
      }
    };

    vm.getUserType = function () {
      if (user && user.lomis_stock){
        var possibleUserTypes =  Object.keys(user.lomis_stock);
        var userType = '';
        for (var i in possibleUserTypes){
          if (! _.isEmpty(user.lomis_stock[possibleUserTypes[i]])) {
            userType += possibleUserTypes[i] + " ";
          }
        }
        return userType.trim();
      }
      return '';
    };
  }]);
