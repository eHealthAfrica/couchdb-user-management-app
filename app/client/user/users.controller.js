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
    'adminLevels',
    'locations',
    'facilities',
    'programs',
    'facilityPrograms',
    'PAGE_SIZE',
    function ($scope, $location, alertService, userService, $filter, users, adminLevels, locations, facilities, programs, facilityPrograms, PAGE_SIZE) {

    var vm = this;


      vm.users = _.forEach(_.map(users.rows, 'value'), function (elem) {
        elem.user_type = $filter('getUserType')(elem);
        elem.user_role = [ getAdminLevel(elem), getLocations(elem)]
      });

      vm.selection = [];

      vm.simpleTableConfig = {
        allowFilter: false,
        allowSelect: true,
        allowSort:  true,
        arrayFields: ['user_role'],
        rowActions: ['assign role', 'edit', 'show', 'delete'],
        rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
        tableHeader: ['name', 'user_role', 'status'],
        toggleFields: [{ name: 'status', positive: 'active'}]
      };

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

      vm.onPageRequested = function (skip, limit) {
        userService.getPage(skip, limit, vm.sortOptions.by, vm.sortOptions.direction).then(function (resp) {
          vm.users = _.forEach(_.map(resp.rows, 'value'), function (elem) {
            elem.user_type = $filter('getUserType')(elem);
            elem.user_role = [ getAdminLevel(elem), getLocations(elem)]
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


      function getRole (user) {

        if ( ! user.lomis_stock || ( ! user.lomis_stock.mobile || ! user.lomis_stock.dashboard) ||   ( _.isEmpty(user.lomis_stock.mobile) && _.isEmpty(user.lomis_stock.dashboard))) { return 'None'; }
        else if (_.isEmpty(user.lomis_stock.mobile)) { return 'Dashboard'; }
        else { return 'Mobile'; }
      };

      function getAdminLevel (user) {


        switch ( getRole (user) ) {
          case 'Mobile':
            return 'Facility';
          case 'None':
            return 'Unassigned';
          case 'Dashboard':
            var id =  user.lomis_stock.dashboard.access.level;

            for (var i in adminLevels) {
              if (adminLevels[i]._id === id) {
                return adminLevels[i].name;
              }
            }
            return "Unknown Access Level";
        }

      };

      function getLocations (user) {
        if (getRole(user) === 'None') { return null;}
        if ( getRole(user) === 'Mobile' ) {
          var userFacilities =  user.lomis_stock.mobile.facilities;
          var assignedFacilities = '';

          for (var i in userFacilities) {
            var facility =  Object.keys(userFacilities[i]);
            if (facility.length > 0) {
              for (var i in facilities ) {
                if (facilities[i]._id === facility[0]) {
                  assignedFacilities += facilities[i].name + ' ';
                }
              }
            }

          }
          return assignedFacilities;
        }
        else {
          var accessLevel = user.lomis_stock.dashboard.access.level;
          var accessItems = user.lomis_stock.dashboard.access.items;
          var accessItem =  null;
          for (var i in accessItems) {
            if ( accessItems[i][accessLevel] ){
              accessItem =  accessItems[i][accessLevel];
              break;
            }
          }
          var assignedLocations = '';

          for (var i in accessItem) {
            for (var j in locations) {
              if (locations[j]._id === accessItem[i]) {
                assignedLocations += locations[j].name;
              }
            }
          }

          return assignedLocations;



        }
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
