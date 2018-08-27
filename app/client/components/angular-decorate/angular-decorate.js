(function (exports) {
  'use strict';
  
  var _module = exports.angular.module;
  
  exports.angular.module = function () {
    var module = _module.apply(this, arguments);
    
    module.decorate = function (target, decoratorFn) {
      module.config(['$provide', function ($provide) {
        $provide.decorator(target, decoratorFn);
      }]);
      return module;
    };
    
    return module;
  };
  
}(this));
