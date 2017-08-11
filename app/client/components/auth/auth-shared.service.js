angular.module('app.auth')
  .factory('SharedAuth', ['$cookies', '$window', 'Shared', function ($cookies, $window, Shared) {
    function decorateHeader (headers) {
      var config = Shared.getConfig()
      switch (config.auth.type.toLowerCase()) {
        case 'cookies':
          var cookie
          try {
            cookie = $cookies.getObject(config.auth.cookies.name)
          } catch (e) {
            cookie = $cookies.get(config.auth.cookies.name)
          }
          if (config.auth.cookies.authType.toLowerCase() === 'bearer') {
            headers.Authorization = 'Bearer '.concat(cookie)
          }
          break
      }
      return headers
    }

    function isLoggedIn () {
      var config = Shared.getConfig()
      switch (config.auth.type.toLowerCase()) {
        case 'cookies':
          if ($cookies.get(config.auth.cookies.name) !== undefined) {
            return true
          }
          break
      }
      $window.location.href = config.auth.redirectUrl
    }

    function logOut () {
      var config = Shared.getConfig()
      switch (config.auth.type.toLowerCase()) {
        case 'cookies':
          $cookies.remove(config.auth.cookies.name)
          break
      }
      $window.location.href = config.auth.redirectUrl
    }

    return {
      decorateHeader: decorateHeader,
      isLoggedIn: isLoggedIn,
      logOut: logOut
    }
  }])
