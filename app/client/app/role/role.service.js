/* global angular */
/* global _ */
/* jshint node: true */
'use strict';

angular.module('app.role')
.service('adminLevelService', [ '$http', function ($http) {

    var URL = '/api/admin_level';


  this.getAll =  function () {


    var promise = $http.get(  URL, {  withCredentials: true });
    return promise.then(function (response) {

      var sortedAdminLevel = [];

      for (var i in response.data) {
        if (response.data[i].parent === null) {
          sortedAdminLevel.push(response.data[i]);
        }
      }

      for (var k = 0; k < response.data.length; k++) {
        var parId =  sortedAdminLevel[sortedAdminLevel.length -1]._id;
        for (var j in response.data) {
          if (response.data[j].parent === parId) {
            sortedAdminLevel.push(response.data[j]);
          }
        }
      }

      return sortedAdminLevel;
    }, function(err) {
        return err;
    });
  };

}])
  .service('facilityService', [ '$http', function ($http) {

    var URL = '/api/facilities';
    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {
        return response.data;
      }, function(err) {
        return err;
      });
    };
  }])
  .service('facilityProgramsService', [ '$http', function ($http) {

    var URL = '/api/common/facility-program';
    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {
        return response.data;
      }, function(err) {
        return err;
      });
    };
  }])
  .service('locationService', [ '$http', function ($http) {

    var URL = '/api/location';

    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {


        return response.data;
      }, function(err) {
        return err;
      });
    };



  }])
  .service('programService', [ '$http', function ($http) {

    var URL = '/api/program';

    this.getAll =  function () {
      var promise = $http.get(  URL, {  withCredentials: true });
      return promise.then(function (response) {


        return response.data;
      }, function(err) {
        return err;
      });
    };


  }]);



angular.module('app.user').decorate('userDecoratorService', [
  '$delegate',
  '$q',
  'Shared',
  'adminLevelService',
  'facilityService',
  'locationService',
  'programService',
  function ($delegate, $q, Shared, adminLevelService, facilityService,  locationService, programService) {


    $delegate.decorate =  function (fields, users) {
      var promises = $q.all([
        adminLevelService.getAll(),
        facilityService.getAll(),
        locationService.getAll(),
        programService.getAll()
      ]);

      return promises.then( function (responses) {

        var programsById =  _.keyBy(responses[3], '_id');

        function getRole (user) {
          if (
            !user.lomis_stock ||
            ( !user.lomis_stock.mobile ||
            !user.lomis_stock.dashboard) ||
            ( _.isEmpty(user.lomis_stock.mobile) && _.isEmpty(user.lomis_stock.dashboard))
          ) {
            return 'None';
          }
          else if (_.isEmpty(user.lomis_stock.mobile)) {
            return 'Dashboard';
          }
          else {
            return 'Mobile';
          }
        }
        function getAdminLevel (user) {
          switch (getRole(user)) {
            case 'Mobile':
              return 'Facility';
            case 'None':
              return 'Unassigned';
            case 'Dashboard':
              var id = user.lomis_stock.dashboard.access.level;

              for (var i in responses[0]) {
                if (responses[0][i]._id === id) {
                  return responses[0][i].name;
                }
              }
              return "Unknown Access Level";
          }
        };
        function getLocation (user) {
          if (getRole(user) === 'None') { return null;}
          if (getRole(user) === 'Mobile') {
            var userFacilities = user.lomis_stock.mobile.facilities;
            var assignedFacilities = '';

            for (var i in userFacilities) {
              var facility = Object.keys(userFacilities[i]);
              if (facility.length > 0) {
                for (var j in responses[1]) {
                  if (responses[1][j]._id === facility[0]) {
                    assignedFacilities += responses[1][j].name + ' ';
                  }
                }
              }

            }
            return assignedFacilities;
          }
          else {
            var accessLevel = user.lomis_stock.dashboard.access.level;
            var accessItems = user.lomis_stock.dashboard.access.items;
            var accessItem = null;
            for (var i in accessItems) {
              if (accessItems[i][accessLevel]) {
                accessItem = accessItems[i][accessLevel];
                break;
              }
            }
            var assignedLocations = '';

            for (var i in accessItem) {
              for (var j in responses[2]) {
                if (responses[2][j]._id === accessItem[i]) {
                  assignedLocations += responses[2][j].name;
                }
              }
            }
            return assignedLocations;
          }
        };
        function getPrograms (user) {
          var programList = [];

          switch(getRole(user)) {
            case 'Mobile':
              var facility =  user.lomis_stock.mobile.facilities[0]  || {};
              var props =  Object.keys(facility);
              var facilityPrograms = [];
              _.forEach(props, function (prop) {
                _.forEach(facility[props], function (program) {
                  facilityPrograms.push(program);
                });
              });
              _.forEach(facilityPrograms, function (program) {
                if (programsById[program]){
                  programList.push(programsById[program].name);
                }
              })
              break;
            case 'Dashboard':
              var userProgramList =  user.lomis_stock.dashboard.access.programs || []
              _.forEach(userProgramList, function (program) {
                if (programsById[program]){
                  programList.push(programsById[program].name);
                }
              })
              break;
          }

          return programList;
        }

        var workspace =  Shared.getConfig().workSpace || 'umsWorkspace';


        for (var i in users) {
          console.log("qq");
          users[i][workspace] = {};
          if (i === '0') {
            console.log("got here",  users[i])
          }
          users[i][workspace]['admin_level'] =  getAdminLevel(users[i]);
          users[i][workspace]['location'] = getLocation(users[i]);
          users[i][workspace]['programs'] =  getPrograms(users[i]);
          if (i === 0) {
            console.log("got here",  users[i])
          }
        }
      })
    }
  return $delegate;
}]);
