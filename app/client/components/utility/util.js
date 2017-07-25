angular.module('app.utility')
  .factory('Util', function () {

    function getProperty ( object, property) {
      var outcome =  object;
      var propertyPath =  property.split('.');
      for (var i in propertyPath) {
        outcome =  outcome[propertyPath[i]];
      }
      return outcome;
    }

    return {
      getProperty:  getProperty
    }

  })
