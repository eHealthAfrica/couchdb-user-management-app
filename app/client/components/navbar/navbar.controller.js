angular.module('app.navbar', [])
  .controller('navbarCtrl', [ '$http', 'NAVIGATION', 'CURRENT_USER', function ($http, NAVIGATION, CURRENT_USER) {

    var vm = this;
    vm.additionalNavigation =  NAVIGATION;
    vm.username = "";

    getCurrentUser();


    vm.navigateTo = function (navigationCategory, index) {
      var providedURL;

      switch(navigationCategory) {
        case 0:
          providedURL =  vm.additionalNavigation.customNavbarLinks[index].url
          break;
        case 1:
          providedURL =  vm.additionalNavigation.sidebarLinks[index].url;
          break;
        case 2:
          providedURL = vm.additionalNavigation.userDropdown[index].url;
          break;
      }

      if (providedURL.indexOf('/') === 0) {
        window.location = window.location.protocol + "//" +  window.location.host  + providedURL ;
      }
      else {
        window.location = providedURL;
      }
    }


    function getCurrentUser () {
      return $http.get( window.location.protocol + "//" +  window.location.host  + CURRENT_USER.url)
          .then(function(response) {
            var currentUser =  response.data;
            var name = '';
            var fieldParts = CURRENT_USER.name_field.split('.');
            for (var i in fieldParts){
              name = currentUser[fieldParts[i]];
            }
            vm.username =  name;
          })
    }

  }]);
