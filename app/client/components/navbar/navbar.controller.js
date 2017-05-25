angular.module('app.navbar', [])
  .controller('navbarCtrl', [ 'NAVIGATION', function (NAVIGATION) {

    var vm = this;
    vm.additionalNavigation =  NAVIGATION;


    vm.navigateTo = function (navigationCategory, index) {
      var providedURL = navigationCategory === 0 ?  vm.additionalNavigation.customNavbarLinks[index].url : vm.additionalNavigation.sidebarLinks[index].url;
      if (providedURL.indexOf('/') === 0) {
        window.location = window.location.protocol + "//" +  window.location.host  + providedURL ;
      }
      else {
        window.location = providedURL;
      }
    }



  }]);
