/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.role')
  .controller('RoleCtrl', ['$scope', '$location', 'userService','alertService', 'Config', 'user', 'adminLevels', 'locations', 'facilities', 'programs', 'facilityPrograms', function($scope, $location, userService, alertService, Config, user, adminLevels, locations, facilities, programs, facilityPrograms){

    var vm = this;

    vm.user =  user;
    vm.config = Config.get()
    vm.adminLevels =  adminLevels;
    vm.locations =  locations;
    vm.facilities =  _.sortBy(facilities, ['name']);
    vm.programs = _.sortBy(programs, ['name']);
    vm.facilityPrograms = facilityPrograms;


    vm.assignedPrograms = [];


    $scope.$watch('vm.updateUserRoleForm.access.level', function (newValue, oldValue) {
      vm.getAssignedLocation();
    });


    vm.submitUpdateUserRoleForm = function () {
      if (vm.updateUserRoleForm.$error && !_.isEmpty(vm.updateUserRoleForm.$error)){
        return;
      }

      // run own verification here ..... send appropriate messages back .....




      var lomis_stock = {dashboard: {}, mobile: {}};

      switch (vm.updateUserRoleForm.type) {
        case 'mobile':
          // throw appropriate error message to the user here .....
          if (!(vm.updateUserRoleForm.facility && vm.updateUserRoleForm.program)) {
            return;
          }

          var facilityEntry = {};
          facilityEntry[vm.updateUserRoleForm.facility] = vm.updateUserRoleForm.program;
          lomis_stock.mobile.facilities = [facilityEntry];
          break;

        case 'dashboard':

          var adminLevelIndex = -1;
          for(var i in vm.adminLevels){ if (vm.adminLevels[i]._id === vm.updateUserRoleForm.access.level){adminLevelIndex = i; break;}}
          if (! vm.updateUserRoleForm.locations[adminLevelIndex + ""] ) {
            return;
          }
          lomis_stock.dashboard = { access: { level: vm.updateUserRoleForm.access.level, programs: vm.updateUserRoleForm.access.programs}, is_admin: vm.updateUserRoleForm.is_admin || false};
          var item = {};
          item[vm.updateUserRoleForm.access.level] = [ vm.updateUserRoleForm.locations[adminLevelIndex + ""] ];
          lomis_stock.dashboard.access.items = [item];
          break;
      }

      userService.update({name : vm.user.name, _id: vm.user._id, lomis_stock: lomis_stock})
        .then(function (response) {
          alertService.showSuccessMessage("Changes successfully saved");
          var path =  'users/view/' + vm.user.name;
          $location.path(path);
        }).catch(function(err) {
          alertService.showErrorMessage('Entry was not updated' + err);
        });
    };

    vm.toggleProgram =  function (id) {
      console.log("THis is it:", vm.updateUserRoleForm.program)
      if (! vm.updateUserRoleForm.program) { vm.updateUserRoleForm.program = []; }
      var index =  vm.updateUserRoleForm.program.indexOf(id);
      if (index < 0) { vm.updateUserRoleForm.program.push(id); }
      else {
        vm.updateUserRoleForm.program.splice(index, 1);
      }
    }

    vm.hasProgram = function (id) {
      return vm.updateUserRoleForm.program.length && (vm.updateUserRoleForm.program.indexOf(id) >= 0);
    }


    vm.getAssignedLocation = function () {

      if (! vm.user.lomis_stock || (! vm.user.lomis_stock.mobile && ! vm.user.lomis_stock.dashboard)) {
        return;
      }

      if (vm.user.lomis_stock.mobile && ! _.isEmpty(vm.user.lomis_stock.mobile)) {
        if (vm.updateUserRoleForm.facility) {
          vm.updateUserRoleForm.program =  [];
          return;
        }


        var facility = vm.user.lomis_stock.mobile.facilities[0];
        vm.updateUserRoleForm.facility =  Object.keys(facility)[0];
        vm.updateUserRoleForm.program =  vm.user.lomis_stock.mobile.facilities[0][vm.updateUserRoleForm.facility];

      }
      else if (vm.user.lomis_stock.dashboard && ! _.isEmpty(vm.user.lomis_stock.dashboard)) {

        //vm.updateUserRoleForm.program =  vm.user.lomis_stock.dashboard.access.programs || [];
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
        if (user.lomis_stock.dashboard && ! _.isEmpty(user.lomis_stock.dashboard)) { return 'dashboard'; }
        else if (user.lomis_stock.mobile && ! _.isEmpty(user.lomis_stock.mobile)) { return 'mobile'; }
      }
      return '';
    };
  }]);
