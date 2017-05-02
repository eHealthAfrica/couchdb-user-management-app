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


    vm.getUserType = function () {
      if (user && user.lomis_stock){
        var possibleUserTypes =  Object.keys(user.lomis_stock);
        var userType = '';
        for (var i in possibleUserTypes){
          userType +=  _.isEmpty(user.lomis_stock[possibleUserTypes[i]]) ? ' ' + possibleUserTypes[i] : '';
        }
        return userType.trim();
      }
      return '';
    };


    vm.getLocation = function (index) {

    };

  }]);
