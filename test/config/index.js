module.exports = {

  auth: {
    type: 'COOKIES',
    cookies: {
      name: 'token',
      authType: 'bearer'
    },
    redirectUrl: '/'
  },

  access: {
   /* allowIf: [
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
    ]*/
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

  filters: [
    {
      type: 'user',
      dependency: {locations: null, facilities: null},
      field:  { id: 'lomis_stock', default: {}},
      filter:  function (dependency, filterParams , users, lodash) {

        var relevantLocations = [];
        var relevantFacilities = [];
        var locations = [];

        var accessItems =  filterParams.lomis_stock.dashboard.access.items;

        lodash.forEach(accessItems, function (item) {
          var items =  item[Object.keys(item)[0]];
          locations = lodash.merge(locations, items);
        });

        lodash.forEach(locations, function (locationId) {

          relevantLocations = lodash.merge(relevantLocations, lodash.map(dependency.locations.filter(function (location) {
            if (location._id === locationId ) { return true; }
            else {
              var locationAncestors =  location.ancestors || [];
              for (var i in locationAncestors) {
                if (locationAncestors[i]._id === locationId) {  return true;}
              }
            }
            return false;
          }), '_id'));


          relevantFacilities =  lodash.merge( relevantFacilities,  lodash.map(dependency.facilities.filter(function (facility) {
            var locationAncestors =  facility.location.ancestors || [];
            for (var j in locationAncestors) {
              if (locationAncestors[j]._id === locationId) {  return true;}
            }
            return false;
          }), '_id'));

        });


        return  users.filter(function (user) {
          if (! user.lomis_stock) { return false;}
          if (user.lomis_stock.dashboard && ! lodash.isEmpty(user.lomis_stock.dashboard)) {

            var items = user.lomis_stock.dashboard.access.items || [];
            var userLocations = [];
            for (var x in items) {
              if (! lodash.isEmpty(items[x])) {
                var key =  Object.keys(items[x])[0];
                for (var y in items[x][key]){
                  userLocations.push(items[x][key][y]);
                }
              }
            }

            for (var z in userLocations) {
              if (relevantLocations.indexOf(userLocations[z]) >= 0) { return true; }
            }

          }
          else if (user.lomis_stock.mobile && ! lodash.isEmpty(user.lomis_stock.mobile)) {

            var facilities = Object.keys(user.lomis_stock.mobile.facilities) || [];
            for (var x in facilities) {
              if (relevantFacilities.indexOf(facilities[x]) >= 0) { return true; }
            }

          }

          return false;
        });

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
      {label: 'name', field:  'name', subFields: [ {field: 'lomis_stock.dashboard.is_admin', displayMode: 'label', positive: true, positiveLabel: 'ADMIN', positiveColour: '#4289CD'}]},
      'admin_level', 'location', 'status'
    ],
    maxColWidth : 25,
    rowActions: ['assign role', 'edit', 'show', 'delete'],
    rowActionClasses: ['glyphicon glyphicon-user', 'glyphicon glyphicon-pencil', 'glyphicon glyphicon-eye-open', 'glyphicon glyphicon-trash'],
    toggleFields: [{
      name: 'status',
      default: 'active',
      positive: 'active',
      negative: 'inactive',
      denyIf: [{
        field: '_id',
        value: "$currentuser$._id"
      }]
    }],
    workSpace: 'umsWorkspace',
    unsortableFields: ['location']
  },

  pagination: {
    pageSize: 30
  },

  testPort: 1333

};
