# couchdb-user-management-system



A  [User Management System](https://github.com/eHealthAfrica/couchdb-user-management-app) app for couchdb apps.



### Prequisites

An Express application (to server the app)




### Installation & Serving

To serve the UMS from an express application, the following are requireed;

A. Add an entry for the UMS in the package.json file (as a dependency). 

```
couchdb-user-management-app": "eHealthAfrica/couchdb-user-management-app#[BRANCH_NAME]
```

B. Update the Main app's route to serve the UMS.


i. You will then need to modify the file `server/routes.js` by adding the following lines:

```
var ums_app = require('couchdb-user-management-app');
app.use('/ums', ums_app([umsConfig]));
```

ii.
The umsConfig object is expected to be in the format stated below

```
{
  auth: {
    type: '[AUTH-TYPE]',
    cookies: {
      name: '[COOKIE-NAME]',
      authType: '[COOKIE-AUTH-TYPE]'
    },
    redirectUrl: '[REDIRECT-URL]'
  },

  access: {
    field: '[ACCESS-PROP]',
    value: [ACCESS-PROP-VALUE]
  },

  couch: {
       host: '[COUCHDB-HOST]',
       port: [COUCHDB-PORT]',
       auth: {username: '[COUCHDB-USER NAME]', password: '[COUCHDB-PASSWORD]'},
       allOrNothing: false,
       forceSave: false
  },

  currentUser: {
    url:'[CURRENT-USER-URL]',
    nameField: '[CURRENT-USER-NAME-FIELD]'
  },

  navigation: {
    customNavbarLinks: [CUSTOM-NAVBAR-LINKS],
    sidebarLinks: [CUSTOM-SIDEBAR-LINKS],
    userDropdown: [USER-DROPDOWN-LINKS]
  },

  roles: [ROLES],

  usersTable: {
    allowFilter: [USERS-FILTER],
    allowSelect: [SELECT-USERS],
    allowSort: [SORT-USERS],
    arrayFields: [ARRAY-FIELDS],
    derivedFields: [DERIVED-USER-FIELDS],
    header: [USERS-TANLE-HEADER],
    maxColWidth : [MAXIMUM-COL-WIDTH],
    rowActions: [ACTIONS-PER-USER-ROLE],
    rowActionClasses: [CLASSES-FOR-USER-ROLE-ACTIONS],
    toggleFields: [TOGGLE-FIELDS],
    unsortableFields: [UNSORTABLE-FIELDS]
  },

  pagination: {
    pageSize: [PAGE-SIZE]
  }
}
```

For more details on the umsConfig, read the guideline [here](../docs/UMS_CONFIG.md).

After starting the Host app, the UMS will be available at `/ums`  or any custom route that has been configured for it (in step B.i above)



### Testing

To test, update the config/index.js file with the details required to connect to couch db then run the command
```
npm test
```

### Other files
[Change log](../CHANGELOG.md)\
[Configuring the UMS](../docs/UMS_CONFIG.md)\
[Sorting and Filtering with couchdb-user-management-app](../docs/SORTING_AND_FILTERING.md)





