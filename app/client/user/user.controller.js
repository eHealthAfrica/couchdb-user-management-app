/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .controller('UserCtrl', ['$rootScope', '$scope', '$location', 'userService', 'users', 'selectedUser', 'alertService', function($rootScope, $scope, $location, userService, users, selectedUser, alertService){

    var vm =  this;

    vm.users = users;
    vm.selectedUser =  selectedUser;
    vm.selection = [];

    vm.simpleTableConfig = {
      allowFilter: false,
      allowSelect: true,
      allowSort:  true,
      rowActions: ['assign role', 'edit', 'show', 'delete'],
      rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
      tableHeader: ['name', 'user_type', 'status']
    };




    vm.rowActionCallback = function (actionIndex, rowIndex) {
        var path = '';
        switch(actionIndex){
          case 0:
            path = 'users/' + vm.users[rowIndex][userService.getSingleRecordKey()] + "/role/edit";
            $location.path(path);
            break;
          case 1:
            path = 'users/edit/' + vm.users[rowIndex][userService.getSingleRecordKey()];
            $location.path(path);
            break;
          case 2:
            path = 'users/view/' + vm.users[rowIndex][userService.getSingleRecordKey()];
            $location.path(path);
            break;
          case 3:
            path = 'users/delete/' + vm.users[rowIndex][userService.getSingleRecordKey()];
            $location.path(path);
            break;
        }
    };

    vm.submitNewUserForm =  function () {

        if (! _.isEmpty(vm.newUserForm.$error)){ return; }
        userService.create(_.pick(vm.newUserForm, ["name", "password", "email"])).then(function(){
            alertService.showSuccessMessage(vm.newUserForm.name + ' successfully created');
            var path =  'users/view/' + vm.newUserForm.name;
            $location.path(path);
        }).catch(function(err){
          if (err.data.name === 'ValidationError'){
            vm.newUserForm['$serverError'] = vm.newUserForm.name;
            return;
          }
          console.log(err);
          alertService.showErrorMessage('Entry was not created');
        });
    };


    vm.submitUpdateUserForm = function () {

      if (! _.isEmpty(vm.updateUserForm.$error)){ return; }
      userService.update(_.pick(vm.updateUserForm, ['name','password', 'email'])).then(function(response){
        //do comparison
        alertService.showSuccessMessage("Changes successfully saved");
        var path =  'users/view/' + vm.updateUserForm.name;
        $location.path(path);
      }).catch(function(err) {
        alertService.showErrorMessage('Entry was not updated');
      });


    };

    vm.deleteOne =  function(name){
      userService.delete(name).then(function(response){
        alertService.showSuccessMessage(name + ' successfully deleted');
        $location.path('users/list');
      }).catch(function(){
        alertService.showErrorMessage('Entry was not created');
      });
    };


    vm.bulkDelete = function () {

    };

    vm.getSelectionCount = function () {
      return vm.selection.filter(function(elem){ return elem; }).length;
    };


  }]);
