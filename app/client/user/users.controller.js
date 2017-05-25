/* global angular */
/* global _ */
/* jshint node: true */

angular.module('app.user')
  .controller('UsersCtrl', [
    '$scope',
    '$location',
    'alertService',
    'userService',
    'userDecoratorService',
    '$filter',
    'users',
    'PAGE_SIZE',
    'USERS_TABLE_CONFIG',
    function ($scope, $location, alertService, userService,userDecoratorService, $filter, users,  PAGE_SIZE, USERS_TABLE_CONFIG) {

      var vm = this;
      vm.searchString  = "";
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

      vm.users =  _.map(users.rows, 'value');
      $scope.users =  users;


      $scope.$watch('users', function (newValue, oldValue) {
        if (newValue !== undefined && newValue !== null) {
          displayPage($scope.users);
          $scope.users = null;
        }
      });


      vm.onSearchStringChanged =  function () {
        vm.searchString =  vm.searchString.trim();
        vm.requestPage(0, PAGE_SIZE);
      }

      vm.requestPage = function (skip, limit) {

        if (skip === 0) {
          vm.simplePaginationConfig.offset = 0;
          vm.simplePaginationConfig.currentPage = 0;
        }

        var promise = vm.searchString.length === 0 ? userService.getPage(skip, PAGE_SIZE, vm.sortOptions.by, vm.sortOptions.direction) : userService.search(skip, PAGE_SIZE, vm.sortOptions.by, vm.sortOptions.direction, vm.searchString);

        promise
          .then(function (users) {
            displayPage(users);
          })
          .catch(function (err) {
            console.log(err);
            displayPage([]);
          });
      };

      vm.sort = function (by, direction) {
        vm.sortOptions.by = by;
        vm.sortOptions.direction =  direction;
        vm.requestPage(0, PAGE_SIZE);
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

      function displayPage (users) {

        if (users && users.rows && users.rows.length > 0 && users.rows[0].value) {
          vm.users = _.map(users.rows, 'value');
        }
        else {
          vm.users =  users.rows;
        }

        if (USERS_TABLE_CONFIG.roleDependedntFields) {
          userDecoratorService.decorate(USERS_TABLE_CONFIG.roleDependedntFields, vm.users)

        }
        vm.simplePaginationConfig.total = users.total_rows;
        vm.simplePaginationConfig.offset =  users.offset;
        
      }

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
