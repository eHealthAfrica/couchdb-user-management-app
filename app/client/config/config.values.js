'use strict';
angular.module('app.config')
  .constant('SETTINGS', {
    userTypes: ['dashboard', 'mobile'],
    auth: {
      type: 'COOKIES',
      cookies: {
        field: 'token',
        authType: 'bearer'
      },
      redirectUrl: '/'
    }
  })
  .value('PAGE_SIZE', 30)
;
