angular.module('app.navbar', [])
  .controller('navbarCtrl', [ '$http', 'Config', function ($http, Config) {

    var vm = this;
    vm.config = Config.get();
    vm.username = "";

    getCurrentUser();

    vm.navigateTo = function (navigationCategory, index) {
      var providedURL;
      switch(navigationCategory) {
        case 0:
          providedURL =  vm.config.navigation.customNavbarLinks[index].url
          break;
        case 1:
          providedURL =  vm.config.navigation.sidebarLinks[index].url;
          break;
        case 2:
          providedURL = vm.config.navigation.userDropdown[index].url;
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
      return $http.get( window.location.protocol + "//" +  window.location.host  + vm.config.currentUser.url)
          .then(function(response) {
            var currentUser =  response.data;
            var name = '';
            var fieldParts = vm.config.currentUser.nameField.split('.');
            for (var i in fieldParts){
              name = currentUser[fieldParts[i]];
            }
            vm.username =  name;

            // TODO: update where this is done
            vm.is_admin =  false;

            if ( currentUser.lomis_stock.dashboard && ! _.isEmpty(currentUser.lomis_stock.dashboard)) {
              vm.is_admin = currentUser.lomis_stock.dashboard.is_admin;
            }
            else if (currentUser.lomis_stock.mobile && ! _.isEmpty(currentUser.lomis_stock.mobile)) {
              vm.is_admin =  false;
            }

            if (! vm.is_admin) {
             // window.location = window.location.protocol + "//" +  window.location.host  ;
            }


          })
    }
  }]);
