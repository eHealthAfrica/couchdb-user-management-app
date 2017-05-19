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
  .value('USERS_TABLE_CONFIG', {
      allowFilter: false,
      allowSelect: true,
      allowSort:  true,
      arrayFields: [],
      header: ['name', 'admin_level', 'location', 'status'],
      roleDependedntFields: ['admin_level', 'location'],
      rowActions: ['assign role', 'edit', 'show', 'delete'],
      rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
      toggleFields: [{ name: 'status', positive: 'active'}],
      unsortableFields: ['location']
  })
  .value('PAGE_SIZE', 30)
;
