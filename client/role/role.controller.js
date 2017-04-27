/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.role')
  .controller('RoleCtrl', ['$scope', '$location', 'userService','alertService', 'user', 'adminLevels', 'locations', 'facilities', 'programs', 'facilityPrograms',  function($scope, $location, userService, alertService, user, adminLevels, locations, facilities, programs, facilityPrograms){

    $scope.user =  user;
    $scope.userTypes =  ['Dashboard', 'Mobile'];
    $scope.adminLevels =  adminLevels;
    $scope.locations =  locations;
    $scope.facilities =  facilities;
    $scope.programs = programs;
    $scope.facilityPrograms = facilityPrograms;



    $scope.submitUpdateUserRoleForm = function () {

      if ($scope.updateUserRoleForm.$error && !_.isEmpty($scope.updateUserRoleForm.$error)){
        return;
      }


      $scope.updateUserRoleForm.lomis_stock = {};

      if ($scope.updateUserRoleForm.type === 'Dashboard') {
        $scope.updateUserRoleForm.lomis_stock.mobile = {};
        var adminLevelIndex = -1;
        for(var i in $scope.adminLevels){ if ($scope.adminLevels[i]._id === $scope.updateUserRoleForm.access.level){adminLevelIndex = i; break;}}

        $scope.updateUserRoleForm.lomis_stock.dashboard = {access: {items:[], level: $scope.updateUserRoleForm.access.level}};
        var item = {};
        item[$scope.updateUserRoleForm.access.level] = [];
        item[$scope.updateUserRoleForm.access.level].push($scope.updateUserRoleForm.locations[adminLevelIndex + ""]);
        $scope.updateUserRoleForm.lomis_stock.dashboard.access.items.push(item);


      } else {
        $scope.updateUserRoleForm.lomis_stock.dashboard = {};
        if ($scope.updateUserRoleForm.facility){
          $scope.updateUserRoleForm.lomis_stock.mobile = {};
          $scope.updateUserRoleForm.lomis_stock.mobile.facilities = [];
          var entry = {};
          entry[$scope.updateUserRoleForm.facility] = [$scope.updateUserRoleForm.program];
          $scope.updateUserRoleForm.lomis_stock.mobile.facilities.push( entry);
        }
      }
      userService.update({name : $scope.user.name, _id: $scope.user._id, lomis_stock: $scope.updateUserRoleForm.lomis_stock}).then(function(response){
        alertService.showSuccessMessage("Changes successfully saved");
        var path =  'users/view/' + $scope.user.name;
        $location.path(path);
      }).catch(function(err) {
        alertService.showErrorMessage('Entry was not updated' + err);
      });




    };


    $scope.getUserType = function () {
      if (user && user.lomis_stock.mobile && user.lomis_stock.dashboard){
        return _.isEmpty(user.lomis_stock.mobile) ? 'Dashboard' : 'Mobile';
      }
      return '';
    };


    $scope.getLocation = function (index) {
      //so what to do?
      //level =  index;

    };

  }]);
