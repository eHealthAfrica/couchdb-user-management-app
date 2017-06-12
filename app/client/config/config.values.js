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
      maxColWidth : 25,
      roleDependedntFields: ['admin_level', 'location'],
      rowActions: ['assign role', 'edit', 'show', 'delete'],
      rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
      toggleFields: [{ name: 'status', positive: 'active'}],
      unsortableFields: ['location']
  })
  .value('NAVIGATION', {
    customNavbarLinks: [{title: 'Goto Dashboard', url: '/', iconClass: 'fa fa-angle-right'}],
    sidebarLinks: [{title: 'Back', url: '/admin', iconClass: 'fa fa-chevron-left fa-fw'}],
    userDropdown: [{title: 'logout', url: '/'}]
  })
  .value('CURRENT_USER', {
    url:'/api/users/me',
    name_field: 'name'
  })
  .value('PAGE_SIZE', 30)
;
