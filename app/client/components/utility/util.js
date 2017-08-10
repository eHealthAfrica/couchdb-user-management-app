angular.module('app.utility')
  .factory('Util', function () {
    function getProperty (object, property) {
      var outcome = object
      var propertyPath = property.split('.')
      for (var i in propertyPath) {
        if (!outcome.hasOwnProperty(propertyPath[i])) { return null }
        outcome = outcome[propertyPath[i]]
      }
      return outcome
    }

    return {
      getProperty: getProperty
    }
  })
