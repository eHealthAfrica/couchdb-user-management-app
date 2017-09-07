angular.module('app.utility')
  .directive("loader", ['Shared', function (Shared) {
    return {

      link: function (scope, element, attributes) {
        scope.$watch(function () {
          return element.height()
        }, function (newVal, oldVal) {
          Shared.setParentHeight(newVal);
        });
      }
    }
  }])
  .directive("loaders",[ 'Shared', function (Shared) {
    return {
      template: "<div class='preloader'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>",
      link: function (scope, element, attributes) {
        scope.$watch(function(){return Shared.getParentHeight()}, function (newVal, oldVal) {
          var newHeight = Shared.getParentHeight();
          var newLoaderHeight = newHeight - 84;
          element.css("height", newLoaderHeight + "px");
        })
      }
    }
  }]);
