angular.module('app.utility', [])
  .factory('Shared', function () {

    var parentHeight = 0;
    var config = {};

    return {
      getConfig: getConfig,
      setConfig: setConfig,
      getParentHeight: getParentHeight,
      setParentHeight: setParentHeight
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

      /*var workSpace =  cfg.workSpace || 'umsWorkspace';

      for (var i in cfg.usersTable.header) {
        if (typeof  cfg.usersTable.header[i] === 'object') {
          if (cfg.usersTable.derivedFields.indexOf(cfg.usersTable.header[i].field) >= 0) {
            cfg.usersTable.header[i].field =  workSpace + '.' +  cfg.usersTable.header[i].field;
          }
        }else {
          if (cfg.usersTable.derivedFields.indexOf(cfg.usersTable.header[i]) >= 0) {
            cfg.usersTable.header[i] =  workSpace + '.' +  cfg.usersTable.header[i];
          }
        }
      }*/
      config =  cfg;

    }

  })
