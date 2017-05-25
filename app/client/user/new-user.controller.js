/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.user')
  .controller('NewUserCtrl', ['$scope', '$location', 'alertService', 'userService',   function($scope, $location, alertService, userService){
    var vm =  this;

    vm.submitNewUserForm =  function () {
      if (! _.isEmpty(vm.newUserForm.$error)){ return; }
      userService.create(_.pick(vm.newUserForm, ["name", "password", "email"]))
        .then(function(){
          alertService.showSuccessMessage(vm.newUserForm.name + ' successfully created');
          var path =  'users/view/' + vm.newUserForm.name;
          $location.path(path);
        })
        .catch(function(err){
          console.log(err);
          if (err.data.name === 'ValidationError'){
            vm.newUserForm.$serverError = vm.newUserForm.name;
            return;
          }
          alertService.showErrorMessage('Entry was not created');
        });
    };

  }]);
