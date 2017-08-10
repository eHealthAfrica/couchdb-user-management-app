angular.module('app.navbar', [])
  .controller('navbarCtrl', [ '$http', '$window', 'Auth', 'Shared', function ($http, $window, Auth, Shared) {
    var vm = this
    vm.config = Shared.getConfig()
    vm.username = ''

    getCurrentUserName()

    vm.navigateTo = function (navigationCategory, index) {
      var providedURL
      switch (navigationCategory) {
        case 0:
          providedURL = vm.config.navigation.customNavbarLinks[index].url
          break
        case 1:
          providedURL = vm.config.navigation.sidebarLinks[index].url
          break
        case 2:
          providedURL = vm.config.navigation.userDropdown[index].url
          break
      }

      if (providedURL.indexOf('/') === 0) {
        $window.location = $window.location.protocol + '//' + $window.location.host + providedURL
      } else {
        $window.location = providedURL
      }
    }

    function getCurrentUserName () {
      var currentUser = Auth.getCurrentUser()
      var userPropValue = currentUser
      var pathToName = vm.config.currentUser.nameField.split('.')
      for (var i in pathToName) {
        userPropValue = userPropValue[pathToName[i]]
      }
      vm.username = userPropValue
    }
  }])
