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
    allowIf: [
      {
        field: 'lomis_stock.dashboard.is_admin',
        value: true
      },
      {
        field: 'status',
        value: 'active'
      }
    ],
    denyIf: [
      {
        field: 'status',
        value: 'inactive'
      }
    ]
  },

  couch: {
    host: 'http://127.0.0.1',
    port: '5984',
    auth: {username: 'admin', password: 'admin'},
    allOrNothing: false,
    forceSave: false
  },

  currentUser: {
    url: '/api/users/me',
    nameField: 'name'
  },

  defaultFilters: [
    {
      type: 'user',
      field: 'lomis_stock.dashboard.access.items',
      reducer: function () {
        return ''
      }
    }
  ],

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
    header: [
      {label: 'name', field: 'name', subFields: [ {field: 'lomis_stock.dashboard.is_admin', displayMode: 'label', positive: true, positiveLabel: 'ADMIN', positiveColour: '#4289CD'} ]},
      'admin_level', 'location', 'status'
    ],
    maxColWidth: 25,
    rowActions: ['assign role', 'edit', 'show', 'delete'],
    rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
    toggleFields: [{
      name: 'status',
      default: 'active',
      positive: 'active',
      negative: 'inactive',
      denyIf: [{
        field: '_id',
        value: '$currentuser$._id'
      }]
    }],
    unsortableFields: ['location']
  },

  pagination: {
    pageSize: 30
  },

  testPort: 1337

}
