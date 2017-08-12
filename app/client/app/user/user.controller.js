/* global angular */
/* global _ */
/* jshint node: true */
'use strict'

angular.module('app.user')
  .controller('UserCtrl', [ '$location', '$scope', '$window', 'Shared', 'alertService', 'userService', 'user', function ($location, $scope, $window, Shared, alertService, userService, user) {
    var vm = this
    vm.user = user
    vm.loadRoles = Shared.getConfig().roles.enable

    vm.submitUpdateUserForm = function () {
      if (!_.isEmpty(vm.updateUserForm.$error)) { return }
      userService.update(_.pick(vm.updateUserForm, ['name', 'password', 'email']))
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
