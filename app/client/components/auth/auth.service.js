angular.module('app.auth', [])
  .factory('Auth', ['$cookies','$http', '$window', 'Shared', 'SharedAuth', function ($cookies, $http, $window, Shared, SharedAuth) {

    var config = null;
    var currentUser = null;

    function getCurrentUser () {
      var config =  Shared.getConfig();
      if (currentUser !== null) {
        return currentUser;
      }

      var promise =  $http({
        url: config.currentUser.url,
        method: 'GET',
        withCredentials: true
      });

      return promise.then(function (response) {
        currentUser =  response.data;
        return response.data;
      }, function (err) {
          return err;
      });
    }

    function isAuthorized () {
      if (! config) {
        config =  Shared.getConfig();
      }

      if (SharedAuth.isLoggedIn()) {
         var authorizationFieldPath = config.access.field.split(".");
         var authorizationRequirement = config.access.value;
         var userAuthorization = currentUser;
         for (var i in authorizationFieldPath) {
         userAuthorization =  userAuthorization[authorizationFieldPath[i]];
         }
         if (userAuthorization === authorizationRequirement) { return true;}
      }
      $window.location.href = config.auth.redirectUrl;
    }

    return  {
      getCurrentUser : getCurrentUser,
      isAuthorized: isAuthorized
    }

  }])
