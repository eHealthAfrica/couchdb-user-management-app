/* global angular */
/* global _ */
/* jshint node: true */
'use strict'

angular.module('app.role')
  .controller('RoleCtrl', ['$scope', '$location', 'userService', 'alertService', 'Config', 'user', 'adminLevels', 'locations', 'facilities', 'programs', 'facilityPrograms', function ($scope, $location, userService, alertService, Config, user, adminLevels, locations, facilities, programs, facilityPrograms) {
    var vm = this

    vm.user = user
    vm.config = Config.get()
    vm.adminLevels = adminLevels
    vm.locations = locations
    vm.facilities = facilities
    vm.programs = _.sortBy(programs, ['name']);
    vm.facilityPrograms = facilityPrograms


    $scope.$watch('vm.updateUserRoleForm.access.level', function (newValue, oldValue) {
      vm.getAssignedLocation()
    })

    vm.submitUpdateUserRoleForm = function () {
      if (vm.updateUserRoleForm.$error && !_.isEmpty(vm.updateUserRoleForm.$error)) {
        return
      }

      var lomisStock = {dashboard: {}, mobile: {}}

      switch (vm.updateUserRoleForm.type) {
        case 'mobile':
          if (!(vm.updateUserRoleForm.facility && vm.updateUserRoleForm.program)) {
            return
          }

          var facilityEntry = {}
          facilityEntry[vm.updateUserRoleForm.facility] = [vm.updateUserRoleForm.program]
          lomisStock.mobile.facilities = [facilityEntry]
          break

        case 'dashboard':

          var adminLevelIndex = -1
          for (var i in vm.adminLevels) { if (vm.adminLevels[i]._id === vm.updateUserRoleForm.access.level) { adminLevelIndex = i; break } }
          if (!vm.updateUserRoleForm.locations[adminLevelIndex + '']) {
            return
          }
          lomisStock.dashboard = { access: { level: vm.updateUserRoleForm.access.level }, is_admin: vm.updateUserRoleForm.is_admin || false }
          var item = {}
          item[vm.updateUserRoleForm.access.level] = [ vm.updateUserRoleForm.locations[adminLevelIndex + ''] ]
          lomisStock.dashboard.access.items = [item]
          break
      }

      userService.update({name: vm.user.name, _id: vm.user._id, lomis_stock: lomisStock})
        .then(function (response) {
          alertService.showSuccessMessage('Changes successfully saved')
          var path = 'users/view/' + vm.user.name
          $location.path(path)
        }).catch(function (err) {
          alertService.showErrorMessage('Entry was not updated' + err)
        })
    }

    vm.getAssignedLocation = function () {
      if (!vm.user.lomis_stock || (!vm.user.lomis_stock.mobile && !vm.user.lomis_stock.dashboard)) {
        return
      }

      if (vm.user.lomis_stock.mobile && !_.isEmpty(vm.user.lomis_stock.mobile)) {
        if (vm.updateUserRoleForm.facility) {
          vm.updateUserRoleForm.program = null
          return
        }

        var facility = vm.user.lomis_stock.mobile.facilities[0]
        vm.updateUserRoleForm.facility = Object.keys(facility)[0]
        vm.updateUserRoleForm.program = vm.user.lomis_stock.mobile.facilities[0][vm.updateUserRoleForm.facility][0]
      } else if (vm.user.lomis_stock.dashboard && !_.isEmpty(vm.user.lomis_stock.dashboard)) {
        var accessLevel = vm.user.lomis_stock.dashboard.access.level
        var accessItemId = vm.user.lomis_stock.dashboard.access.items[0][accessLevel][0]
        var accessItem = null

        for (var i in vm.locations) {
          if (vm.locations[i]._id === accessItemId) {
            accessItem = vm.locations[i]
            break
          }
        }

        var ancestors = _.orderBy(accessItem.ancestors, ['level'], ['asc'])
        vm.updateUserRoleForm.locations = []

        for (var key in ancestors) {
          vm.updateUserRoleForm.locations[key] = ancestors[key]._id
        }
        vm.updateUserRoleForm.locations[ancestors.length] = accessItemId
      }
    }

    vm.getUserType = function () {
      if (user && user.lomis_stock) {
        if (user.lomis_stock.dashboard && !_.isEmpty(user.lomis_stock.dashboard)) { return 'dashboard' } else if (user.lomis_stock.mobile && !_.isEmpty(user.lomis_stock.mobile)) { return 'mobile' }
      }
      return ''
    }
  }])
