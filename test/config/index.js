module.exports = {
  auth: {
    type: 'COOKIES',
    cookies: {
      name: 'my_token',
      authType: 'bearer'
    },
    redirectUrl: '/'
  },

  access: {
    field: 'dashboard.is_admin',
    value: true
  },

  couch: {
    host: 'http://127.0.0.1',
    port: '5984',
    auth: {username: 'admin', password: 'admin'},
    allOrNothing: false,
    forceSave: false
  },

  currentUser: {
    url:'/api/users/me',
    nameField: 'name'
  },

  navigation: {
    customNavbarLinks: [{title: 'Goto Dashboard', url: '/', iconClass: 'fa fa-angle-right'}],
    sidebarLinks: [{title: 'Back', url: '/admin', iconClass: 'fa fa-chevron-left fa-fw'}],
    userDropdown: [{title: 'logout', url: '/'}]
  },

  roles: ['dashboard', 'mobile'],

  usersTable: {
    allowFilter: false,
    allowSelect: true,
    allowSort: true,
    arrayFields: [],
    derivedFields: ['admin_level', 'location'],
    header: ['name', 'admin_level', 'location', 'status'],
    maxColWidth : 25,
    rowActions: ['assign role', 'edit', 'show', 'delete'],
    rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
    toggleFields: [{ name: 'status', positive: 'active'}],
    unsortableFields: ['location']
  },

  pagination: {
    pageSize: 30
  },

  testPort: 1337
}
