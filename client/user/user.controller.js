/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .controller('UserCtrl', ['$rootScope', '$scope', '$location', 'userService', 'users', 'selectedUser', 'alertService', function($rootScope, $scope, $location, userService, users, selectedUser, alertService){


    $scope.users = users;
    $scope.selectedUser =  selectedUser;
    $scope.selection = [];

    $scope.simpleTableConfig = {
      allowFilter: false,
      allowSelect: true,
      allowSort:  true,
      rowActions: ['assign role', 'edit', 'show', 'delete'],
      rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
      rowActionCallback: $scope.rowActionCallback,
      tableHeader: ['name', 'user_type', 'status']
    };




    $scope.rowActionCallback = function (actionIndex, rowIndex) {
        var path = '';
        switch(actionIndex){
          case 0:
            path = 'users/' + $scope.users[rowIndex][userService.getSingleRecordKey()] + "/role/edit";
            $location.path(path);
            break;
          case 1:
            path = 'users/edit/' + $scope.users[rowIndex][userService.getSingleRecordKey()];
            $location.path(path);
            break;
          case 2:
            path = 'users/view/' + $scope.users[rowIndex][userService.getSingleRecordKey()];
            $location.path(path);
            break;
          case 3:
            path = 'users/delete/' + $scope.users[rowIndex][userService.getSingleRecordKey()];
            $location.path(path);
            break;
        }
    };

    $scope.submitNewUserForm =  function () {

        if (! _.isEmpty($scope.newUserForm.$error)){ console.log($scope.newUserForm); return; }
        userService.create(_.pick($scope.newUserForm, ["name", "password", "email"])).then(function(){
            alertService.showSuccessMessage($scope.newUserForm.name + ' successfully created');
            var path =  'users/view/' + $scope.newUserForm.name;
            $location.path(path);
        }).catch(function(err){
          alertService.showErrorMessage('Entry was not created' + err);
        });
    };


    $scope.submitUpdateUserForm = function () {

      if (! _.isEmpty($scope.updateUserForm.$error)){ return; }
      userService.update(_.pick($scope.updateUserForm, ['name','password', 'email'])).then(function(response){
        //do comparison
        alertService.showSuccessMessage("Changes successfully saved");
        var path =  'users/view/' + $scope.updateUserForm.name;
        $location.path(path);
      }).catch(function(err) {
        alertService.showErrorMessage('Entry was not updated');
      });


    };

    $scope.deleteOne =  function(name){
      userService.delete(name).then(function(response){
        alertService.showSuccessMessage(name + ' successfully deleted');
        $location.path('users/list');
      }).catch(function(){
        alertService.showErrorMessage('Entry was not created');
      });
    };


    $scope.bulkDelete = function () {

    };

    $scope.getSelectionCount = function () {
      return $scope.selection.filter(function(elem){ return elem; }).length;
    };


  }]);