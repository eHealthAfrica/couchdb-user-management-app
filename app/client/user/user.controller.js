/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .controller('UserCtrl', ['$scope', '$location', 'alertService', 'userService',  'user',  function($scope, $location, alertService, userService, user){
    var vm =  this;
    vm.user =  user;

    vm.submitNewUserForm =  function () {
      if (! _.isEmpty(vm.newUserForm.$error)){ return; }
      userService.create(_.pick(vm.newUserForm, ["name", "password", "email"]))
        .then(function(){
          alertService.showSuccessMessage(vm.newUserForm.name + ' successfully created');
          var path =  'users/view/' + vm.newUserForm.name;
          $location.path(path);
        })
        .catch(function(err){
          if (err.data.name === 'ValidationError'){
            vm.newUserForm.$serverError = vm.newUserForm.name;
            return;
          }
          alertService.showErrorMessage('Entry was not created');
        });
    };

    vm.submitUpdateUserForm = function () {
      if (! _.isEmpty(vm.updateUserForm.$error)){ return; }
      userService.update(_.pick(vm.updateUserForm, ['name','password', 'email']))
        .then(function(response){
          alertService.showSuccessMessage("Changes successfully saved");
          var path =  'users/view/' + vm.updateUserForm.name;
          $location.path(path);
        })
        .catch(function(err) {
          alertService.showErrorMessage('Entry was not updated');
        });
    };

    vm.deleteOne =  function(name){
      userService.delete(name)
        .then(function(response){
          alertService.showSuccessMessage(name + ' successfully deleted');
          $location.path('users/list');
        })
        .catch(function(){
          alertService.showErrorMessage('Entry was not created');
        });
    };
  }]);
