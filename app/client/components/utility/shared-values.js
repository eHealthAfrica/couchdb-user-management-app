angular.module('app.utility', [])
  .factory('Shared', function () {
    var parentHeight = 0
    var config = {}

    return {
      getConfig: getConfig,
      setConfig: setConfig,
      getParentHeight: getParentHeight,
      setParentHeight: setParentHeight
    }

    function setParentHeight (pH) {
      parentHeight = pH
    }

    function getParentHeight () {
      return parentHeight
    }

    function getConfig () {
      return config
    }

    function setConfig (cfg) {
      config = cfg
    }
  })
