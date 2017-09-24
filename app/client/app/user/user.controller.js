/* global angular */
/* global _ */
/* jshint node: true */
'use strict'

angular.module('app.user')
  .controller('UserCtrl', [ '$location', '$scope', '$window', 'Shared', 'alertService', 'userService', 'user', function ($location, $scope, $window, Shared, alertService, userService, user) {
    var vm = this
    vm.user = user
    vm.config =  Shared.getConfig();
    vm.loadRoles = vm.config.roles.enable

    vm.roles = vm.config.roles.enable && vm.config.roles.definition.type.toLowerCase() === 'simple'
      ? {label: vm.config.roles.definition.displayName, options: vm.config.roles.definition.options, mode: vm.config.roles.definition.selectMultiple, required: vm.config.roles.definition.required, type: vm.config.roles.type}
      : {label: null, options: []};

  vm.submitUpdateUserForm = function () {
      if (!_.isEmpty(vm.updateUserForm.$error)) { return }
    var pickList = ['name', 'password', 'email'];
    if (vm.roles.label !== null) { pickList.push('roles'); }

    userService.update(_.pick(vm.updateUserForm, pickList))
        .then(function (response) {
          alertService.showSuccessMessage('Changes successfully saved')
          var path = 'users/view/' + vm.updateUserForm.name
          $location.path(path)
        })
        .catch(function (err) {
          alertService.showErrorMessage('Entry was not updated')
          console.log(err)
        })
    }

    vm.deleteOne = function (name) {
      userService.delete(name)
        .then(function (response) {
          alertService.showSuccessMessage(name + ' successfully deleted')
          $location.path('users/list')
        })
        .catch(function () {
          alertService.showErrorMessage('Entry was not created')
        })
    }

    vm.cancelDelete = function () {
      $window.history.back()
    }
  }])
