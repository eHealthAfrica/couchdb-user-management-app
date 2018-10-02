/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.role')
  .controller('ViewRoleCtrl', ['$scope', '$q', 'adminLevelService', 'facilityService', 'locationService', 'programService', function($scope, $q, adminLevelService, facilityService, locationService, programService){

    var vm = this;
    vm.user =  $scope.$parent.ctrl.user;


    vm.hasNoRole =  ! vm.user.lomis_stock;
    vm.isAnAdmin =  false;

    vm.role = 'None';
    vm.adminLevel = 'Unknown Access Level';
    vm.locations = [];
    vm.programs = [];


    isAnAdmin();


    function getRole() {
      if ( !vm.user.lomis_stock ||(  _.isEmpty(vm.user.lomis_stock.mobile) && _.isEmpty(vm.user.lomis_stock.dashboard))) { return 'None'; }
      else if (_.isEmpty(vm.user.lomis_stock.mobile)) { return 'Dashboard'; }
      else { return 'Mobile'; }
    };

    function isAnAdmin () {
      if (vm.user.lomis_stock && vm.user.lomis_stock.dashboard) {
        vm.user.lomis_stock.dashboard.is_admin || false;
      }
    }

    vm.init =  function () {
      var promises = $q.all([
        adminLevelService.getAll(),
        facilityService.getAll(),
        locationService.getAll(),
        programService.getAll()
      ]);

      promises.then(function (responses) {

        var adminLevels = _.keyBy(responses[0], '_id');
        var facilities = _.keyBy(responses[1], '_id');
        var locations = _.keyBy(responses[2], '_id');
        var programs = _.keyBy(responses[3], '_id');

        vm.role =  getRole();

        switch (vm.role) {
          case 'Mobile':
            vm.adminLevel = 'Facility';
            var userFacility = vm.user.lomis_stock.mobile.facilities[0] || {};
            var facilityId = Object.keys(userFacility)[0] || null;
            var userPrograms = userFacility[facilityId] || [];
            if (facilities[facilityId]) { vm.locations = [facilities[facilityId].name]; }
            vm.programs = [];
            _.forEach(userPrograms, function (program) {
              if (programs[program]) {
                vm.programs.push(programs[program].name);
              }
            })
            break;
          case 'Dashboard':
            var accessLevel = vm.user.lomis_stock.dashboard.access.level;
            if (adminLevels[accessLevel]) {
              vm.adminLevel = adminLevels[accessLevel].name;
            }
            var accessItems =  vm.user.lomis_stock.dashboard.access.items || []
            var accessList = [];
            _.forEach(accessItems, function (accessItem) {
              if (accessItem[accessLevel]) {
                accessList =  accessItem[accessLevel];
              }
            })
            _.forEach(accessList, function (locationId) {
                if (locations[locationId]) {
                  vm.locations.push(locations[locationId].name)
                }
            })

            var userProgramsList =  vm.user.lomis_stock.dashboard.access.programs || [];
            _.forEach(userProgramsList,  function (programId) {
              if (programs[programId]) {
                vm.programs.push(programs[programId].name)
              }else{
              }
            });
            break;
        }
      });
    }

  }]);
