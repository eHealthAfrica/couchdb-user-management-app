angular.module('app.auth', [])
  .factory('Auth', ['$cookies','$http', '$window', 'Shared', 'SharedAuth', 'Util', function ($cookies, $http, $window, Shared, SharedAuth, Util) {

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
       var passed =  true;

        if (config.access.denyIf) {
          for (var i = 0; i < config.access.denyIf.length; i++) {
            if (config.access.denyIf[i].value === Util.getProperty(currentUser, config.access.denyIf[i].field)) {
              passed =  false;
              break;
            }
          }
        }

        if (config.access.allowIf) {
          for (var i = 0; i < config.access.allowIf.length; i++) {
            if (config.access.allowIf[i].value !== Util.getProperty(currentUser, config.access.allowIf[i].field)) {
              passed =  false;
              break;
            }
          }
        }

        if (passed) { return true; }
      }
      $window.location.href = config.auth.redirectUrl;
    }

    return  {
      getCurrentUser : getCurrentUser,
      isAuthorized: isAuthorized
    }

  }])
