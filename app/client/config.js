'use strict';
angular.module('config', [])
  .constant('SETTINGS', {userTypes: ['dashboard', 'mobile']})
  .value('PAGE_SIZE', 10)
;
