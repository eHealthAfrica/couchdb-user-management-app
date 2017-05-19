/* global angular */
/* global _ */
/* jshint node: true */

angular.module('app.user')
  .controller('UsersCtrl', [
    '$scope',
    '$location',
    'alertService',
    'userService',
    'usersDependencyService',
    '$filter',
    'users',
    'PAGE_SIZE',
    'USERS_TABLE_CONFIG',
    function ($scope, $location, alertService, userService,usersDependencyService, $filter, users,  PAGE_SIZE, USERS_TABLE_CONFIG) {

    var vm = this;


      vm.users = _.forEach(_.map(users.rows, 'value'), function (elem) {
        elem.user_type = $filter('getUserType')(elem);

        if (USERS_TABLE_CONFIG.roleDependedntFields) {
          for (var i in USERS_TABLE_CONFIG.roleDependedntFields) {
            const field =  USERS_TABLE_CONFIG.roleDependedntFields[i];
            usersDependencyService.get(field, elem)
              .then(function (prop) {
                elem[field] =  prop;
              })
          }
        }

      });

      vm.selection = [];

      vm.simpleTableConfig = USERS_TABLE_CONFIG;

      vm.simplePaginationConfig = {
        currentPage: 0,
        total: users.total_rows,
        offset: users.offset,
        pageSize: PAGE_SIZE
      };

      vm.sortOptions = {
        by: null,
        direction: null
      }

      //usersDependencyService.get("qq", "Hello!");

      vm.onPageRequested = function (skip, limit) {
        userService.getPage(skip, limit, vm.sortOptions.by, vm.sortOptions.direction).then(function (resp) {
          vm.users = _.forEach(_.map(resp.rows, 'value'), function (elem) {
            elem.user_type = $filter('getUserType')(elem);

            if (USERS_TABLE_CONFIG.roleDependedntFields) {
              for (var i in USERS_TABLE_CONFIG.roleDependedntFields) {
                const field =  USERS_TABLE_CONFIG.roleDependedntFields[i];
                usersDependencyService.get(field, elem)
                  .then(function (prop) {
                    elem[field] =  prop;
                  })
              }
            }

          });
          vm.simplePaginationConfig.total = resp.total_rows;
          vm.simplePaginationConfig.offset =  resp.offset;
        }).catch(function (err) { console.log(err); return []; });
      };

      vm.onListSortInitiated = function (sortBy, sortDirection) {
        vm.sortOptions.by = sortBy;
        vm.sortOptions.direction =  sortDirection;
        vm.simplePaginationConfig.offset = 0;
        vm.simplePaginationConfig.currentPage = 0;

        vm.onPageRequested(0, vm.simplePaginationConfig.pageSize);
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
