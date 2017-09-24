/* global angular */
/* global _ */
/* jshint node: true */
'use strict'

angular.module('app.user')
  .controller('NewUserCtrl', ['$location', '$scope', 'alertService','Shared', 'userService',  function ($location, $scope, alertService, Shared, userService) {
    var vm = this
    vm.config =  Shared.getConfig();
    vm.roles = vm.config.roles.enable && vm.config.roles.definition.type.toLowerCase() === 'simple'
      ? {label: vm.config.roles.definition.displayName, options: vm.config.roles.definition.options, mode: vm.config.roles.definition.selectMultiple, required: vm.config.roles.definition.required, type: vm.config.roles.type}
      : {label: null, options: []};


    vm.submitNewUserForm = function () {
      if (!_.isEmpty(vm.newUserForm.$error)) { return }
      var pickList = ['name', 'password', 'email'];
      if (vm.roles.label !== null) { pickList.push('roles'); }

      userService.create(_.pick(vm.newUserForm, pickList))
        .then(function () {
          alertService.showSuccessMessage(vm.newUserForm.name + ' successfully created')
          var path = 'users/view/' + vm.newUserForm.name
          $location.path(path)
        })
        .catch(function (err) {
          if (err.data.name === 'ValidationError') {
            vm.newUserForm.$serverError = vm.newUserForm.name
            return
          }
          alertService.showErrorMessage('Entry was not created')
        })
    }
  }])
