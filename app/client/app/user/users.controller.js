/* global angular */
/* global _ */
/* jshint node: true */

angular.module('app.user')
  .controller('UsersCtrl', [
    '$filter',
    '$location',
    '$scope',
    'alertService',
    'Auth',
    'Shared',
    'userService',
    'userDecoratorService',
    'users',
    function ( $filter, $location, $scope, alertService, Auth, Shared, userService,userDecoratorService, users) {


      var vm = this;
      vm.searchString  = "";
      vm.selection = [];
      vm.config = Shared.getConfig();
      vm.simpleTableConfig = vm.config.usersTable

      vm.simplePaginationConfig = {
        currentPage: 0,
        total: users.total_rows,
        offset: users.offset,
        pageSize: vm.config.pagination.pageSize
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
        vm.requestPage(0, vm.config.pagination.pageSize);
      }

      vm.requestPage = function (skip, limit) {

        if (skip === 0) {
          vm.simplePaginationConfig.offset = 0;
          vm.simplePaginationConfig.currentPage = 0;
        }

        var promise = vm.searchString.length === 0 ? userService.getPage(skip, vm.config.pagination.pageSize, vm.sortOptions.by, vm.sortOptions.direction) : userService.search(skip, vm.config.pagination.pageSize, vm.sortOptions.by, vm.sortOptions.direction, vm.searchString);

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
        vm.requestPage(0, vm.config.pagination.pageSize);
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

        var fieldEntry =  vm.config.usersTable.toggleFields[fieldIndex];
        var selectedUser =  vm.users[rowIndex];

        if (fieldEntry.hasOwnProperty('denyIf')) {
          for (var i in fieldEntry.denyIf) {
            var fieldValue =  fieldEntry.denyIf[i].field.toLowerCase().indexOf('$currentuser$.') === 0 ?  Auth.getCurrentUser()[fieldEntry.denyIf[i].field.split('.')[1]]   :    selectedUser[fieldEntry.denyIf[i].field]
            var value =       fieldEntry.denyIf[i].value.toLowerCase().indexOf('$currentuser$.') === 0 ?  Auth.getCurrentUser()[fieldEntry.denyIf[i].value.split('.')[1]]   :    selectedUser[fieldEntry.denyIf[i].value]
            if (fieldValue === value) { return; }
          }
        }

        if (! selectedUser.hasOwnProperty(fieldEntry.name)) {
          if ( fieldEntry.hasOwnProperty('default')) {
            selectedUser[fieldEntry.name] = fieldEntry.default;
          }
        } else {
          if (selectedUser[fieldEntry.name] === fieldEntry.positive) {
            selectedUser[fieldEntry.name] =  fieldEntry.negative;
          } else {
            selectedUser[fieldEntry.name] = fieldEntry.positive;
          }
        }

        userService.update(vm.users[rowIndex])
          .catch (function (err) {
            toggleUserStatus(rowIndex);
          });
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

        if (vm.config.usersTable.derivedFields) {
          userDecoratorService.decorate(vm.config.usersTable.derivedFields, vm.users)

        }
        vm.simplePaginationConfig.total = users.total_rows;
        vm.simplePaginationConfig.offset =  users.offset;

      }

    }
  ]);
