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
      for (var i in response.data){ if (response.data[i].parent === null){ sortedAdminLevel.push(response.data[i]);}}

      for (var k = 0; k < response.data.length; k++){
        var parId =  sortedAdminLevel[sortedAdminLevel.length -1]._id;
        for (var j in response.data){
          if (response.data[j].parent === parId){
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



angular.module('app.user').decorate('usersDependencyService', [
  '$delegate',
  '$q',
  'adminLevelService',
  'facilityService',
  'locationService',
  function ($delegate, $q, adminLevelService, facilityService,  locationService) {

  var getRole =  function (user) {
      if (
        ! user.lomis_stock ||
        ( ! user.lomis_stock.mobile ||
        ! user.lomis_stock.dashboard) ||
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


  $delegate.methods["admin_level"] = function (user) {
    var promise =  adminLevelService.getAll();
     return promise.then(function (response) {
      function getAdminLevel () {
        switch ( getRole (user) ) {
          case 'Mobile':
            return 'Facility';
          case 'None':
            return 'Unassigned';
          case 'Dashboard':
            var id =  user.lomis_stock.dashboard.access.level;

            for (var i in response) {
              if (response[i]._id === id) {
                return response[i].name;
              }
            }
            return "Unknown Access Level";
        }
      };
      return getAdminLevel()
    });
  };



  $delegate.methods["location"] =  function (user) {

   var promises = $q.all([
      facilityService.getAll(),
      locationService.getAll()
    ])
    return promises.then( function (responses) {
      function getLocations () {
        if (getRole(user) === 'None') { return null;}
        if ( getRole(user) === 'Mobile' ) {
          var userFacilities =  user.lomis_stock.mobile.facilities;
          var assignedFacilities = '';

          for (var i in userFacilities) {
            var facility =  Object.keys(userFacilities[i]);
            if (facility.length > 0) {
              for (var i in responses[0] ) {
                if (responses[0][i]._id === facility[0]) {
                  assignedFacilities += responses[1][i].name + ' ';
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
            for (var j in responses[1]) {
              if (responses[1][j]._id === accessItem[i]) {
                assignedLocations +=responses[1][j].name;
              }
            }
          }

          return assignedLocations;



        }
      };

      return getLocations();
    })
   // return $q;
  }



  return $delegate;
}]);
