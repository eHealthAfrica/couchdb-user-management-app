angular.module('app.utility', [])
  .factory('Shared', function () {

    var parentHeight = 0;
    var config = {};
    var currentPage = '';

    return {
      getConfig: getConfig,
      setConfig: setConfig,
      getParentHeight: getParentHeight,
      setParentHeight: setParentHeight,
      getDefaultPageTitle: getDefaultPageTitle
    }

    function setParentHeight(pH) {
      parentHeight = pH;
    }

    function getParentHeight() {
      return parentHeight;
    }

    function getConfig () {
      return config;
    }

    function setConfig (cfg) {
      config =  cfg;
    }

    function getDefaultPageTitle () {
      return "User Management System";
    }

  })
