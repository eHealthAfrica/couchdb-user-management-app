/* global angular */
/* global _ */
/* jshint node: true */

angular.module('app.user')
  .controller('UsersCtrl', [
    '$scope',
    '$location',
    'alertService',
    'userService',
    '$filter',
    'users',
    'PAGE_SIZE',
    function ($scope, $location, alertService, userService, $filter, users, PAGE_SIZE) {
      var vm = this;
      vm.users = _.forEach(_.map(users.rows, 'value'), function (elem) {
        elem.user_type = $filter('getUserType')(elem);
      });
      vm.selection = [];

      vm.simpleTableConfig = {
        allowFilter: false,
        allowSelect: true,
        allowSort:  true,
        rowActions: ['assign role', 'edit', 'show', 'delete'],
        rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
        tableHeader: ['name', 'user_type', 'status'],
        toggleFields: [{ name: 'status', positive: 'active'}]
      };

      vm.simplePaginationConfig = {
        total: users.total_rows,
        offset: users.offset,
        pageSize: PAGE_SIZE
      };

      vm.onPageRequested = function (skip, limit) {
        userService.getPage(skip, limit).then(function (resp) {
          vm.users = _.forEach(_.map(resp.rows, 'value'), function (elem) {
            elem.user_type = $filter('getUserType')(elem);
          });
          vm.simplePaginationConfig.total = resp.total_rows;
          vm.simplePaginationConfig.offset =  resp.offset;
        }).catch(function (err) { console.log(err); return []; });
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

      vm.toggleFieldCalllback = function (fieldIndex , rowIndex) {
        switch (fieldIndex) {
          case 0 :
            toggleUserStatus(rowIndex);
            userService.update(vm.users[rowIndex])
              .catch (function (err) {
                toggleUserStatus(rowIndex);
              });
            break;
        }
      };

      vm.getSelectionCount = function () {
        return vm.selection.filter(function(elem){ return elem; }).length;
      };

      function toggleUserStatus (rowIndex) {
        if ( ! vm.users[rowIndex].status || vm.users[rowIndex].status === 'inactive') {
          vm.users[rowIndex].status = 'active';
        }
        else {
          vm.users[rowIndex].status = 'inactive';
        }
      }
    }
  ]);
