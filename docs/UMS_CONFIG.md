Configuring the UMS
------------------

Complete overview of the umsConfig object.\
For a sample file, refer to: [root_dir/test/config/index.js](../../test/config/index.js) 

* Authentication\
  Holds details on how authentication should be determined.
```
 auth: {
    type: '[AUTH-TYPE]',
    cookies: {
      name: '[COOKIE-NAME]',
      authType: '[COOKIE-AUTH-TYPE]'
    },
    redirectUrl: '[REDIRECT-URL]'
  }
  ```
  
  > **AUTH-TYPE**\
  > Type: String\
  > This specifies the type of authentication to be used. 
  > As at version 3.0.0, the only supported ```AUTH-TYPE``` IS ```'cookies'```
  
  >**COOKIE-NAME**\
  >Type: String\
  > This specifies the name of the cookie that stores the authentication token. 
  
  > **COOKIE-AUTH-TYPE**\
  > Type: String\
  > This specifies how the cookie value would be used. As at version 3.0.0,
  > the only supported ```COOKIE-AUTH-TYPE``` is 
  > ```'BEARER'```. 
  
  > **REDIRECT-URL**\
  > Type: String\
  > This specifies the URL to redirect to on the event that authentication fails.
  
  
  * Authorization\
   Holds details on how to perform authorization of logged in users.
  
  ```
 access: {
     field: '[ACCESS-PROP]',
     value: [ACCESS-PROP-VALUE]
   }
   ```
   
  > **ACCESS-PROP**\
  > Type: String\
  > Specifies the property in the user object which should be used for authorization.
  > For nested properties, use dot notation.\
  > See examples below.
  
  >**ACCESS-PROP-VALUE**\
  >Type: String\
  >Specifies the value of the ```ACCESS-PROP``` field read earlier. When the read value equals the specified value, it is assumed that the user has Authorization to access the UMS. See examples below.
  
  
  > _Authorization Example_:
  > 
  >Case a:\
  > The user object has a field access_level which should have a value of 'admin' for authorized users:\
  > In this case, ```ACCESS-PROP``` would be ```'access_level'``` while ```ACCESS-PROP-VALUE``` would be ```'admin'```
  >
  >Case b:\
  >The user object is defined as  
  > ```{ name: 'alice', app_data: {  credentials: { role: 'basic' } } }```
  > and the required field is ```role``` which is defined in the property ```credentials``` of ```app_data which``` should have a value
  > of ```'advanced'``` for authorized users.\
  > In this case, ```ACCESS-PROP``` would be ```'app_data.credentials.role'``` while ```ACCESS-PROP-VALUE``` would be ```'advanced'```.
  
  
  * CouchDB\
  Holds details on how to connect to couchDB.
  
   ```
   couch: {
         host: '[COUCHDB-HOST]',
         port: [COUCHDB-PORT]',
         auth: {username: '[COUCHDB-USER-NAME]', password: '[COUCHDB-PASSWORD]'},
         allOrNothing: false,
         forceSave: false
    }
   ```

  >**COUCHDB-HOST**\
  >Type: String\
  > Specifies the URL to the couchdb instance
  
  >**COUCHDB-PORT**\
  >Type: String\
  > Specifies the PORT on which the CouchDB instance is listening
  
  >**COUCHDB-USER-NAME**\
  >Type: String\
  >Specifies the username which the UMS would use to access couchDB.\
  >This is expected to be an Admin user who has access to the ```_users``` database.
  
  >**COUCHDB-PASSWORD**\
  >Type: String\
  >Specifies the password for the user specified in ```COUCHDB-USER-NAME```.
  
  * Current User\
  Holds details on how to obtain details of the current logged in user and the field that 
  contains their name.
  
   ```
  currentUser: {
      url:'[CURRENT-USER-URL]',
      nameField: '[CURRENT-USER-NAME-FIELD]'
    }
  ```

  >**CURRENT-USER-URL**\
  >Type: String\
  >Specifies a URL which would be queried upon successful authentication for the details of the logged in user.
  
  
  >**CURRENT-USER-NAME-FIELD**\
  >Type: String\
  >Specifies the field of the user object that holds the name to be displayed.
  >This field also follows the dot-notation as explained in the authorization section above.
  
  * Navigation\
  Holds details on supplementary navigation for the UMS. Thus enabling navigation to be tailored to meet the requirement of any application.
  
  ```
  navigation: {
    customNavbarLinks: [CUSTOM-NAVBAR-LINKS],
    sidebarLinks: [CUSTOM-SIDEBAR-LINKS],
    userDropdown: [USER-DROPDOWN-LINKS]
  }
   ```
   
   >**CUSTOM-NAVBAR-LINKS**\
  >Type: Array of Objects\
  >Specifies additional links to be added to the UMS' navbar.\
  >Each object is defined as follows:\
  >`````{title: '', url: '', iconClass: ''}`````
  >
  >The ```title``` field holds a string which is the display name of the link,\
  >the ```url``` field holds a string which contains the URL to be navigated to when clicked\
  >and the ```iconClass``` field holds a string containing font-awesome or glyphicon classes to be used for the link's icon
  
  
  >**CUSTOM-SIDEBAR-LINKS**\
  >Type: Array of Objects\
  >Specifies additional links to be added to the UMS' sidebar.\
  > The object definition is identical to that of described above under the section
  > ```CUSTOM-NAVBAR-LINKS```
  
  >**USER-DROPDOWN-LINKS**\
  >Type: Array of Objects\
  > Specifies links to added to the dropdown that appears when the user's name is clicked. 
  > If the array is empty, the dropdown is inaccessible and the dropdown menu indicator is hidden
  > Each objec tis defined as follows:\
  > ```{title: '', url: ''}```
  >
  > The ```title``` field holds a string which stores the dropdown element's title while the ```url```
  >field holds a string representing the url to be navigated to.
  
  
  * Roles\
  Holds details on the roles supported by the application.\
  As at v3.0.0, this feature is not fully mature and would be updated in subsequent releases.\
  Currently, it is an Array of Strings which holds all supported roles 
  
 ```
  roles: [ROLES]
 ```
  
 * UsersTable\
 Holds details on the configuration of the users table.
 
 ```
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
  }
```
  
  >**USERS-FILTER**\
  >Type: Boolean\
  >Specifies if the default filter provided by ng-simple-table should be used.
  
  >**SELECT-USERS**\
  >Type: Boolean\
  >Specifies if users can be selected. When turned on, checkboxes appear beside each user row and on the main table header.
  
  >**SORT-USERS**\
  >Type: Boolean\
  >Specifies if the users list can be sorted or not.
  >See [here](../SORTING_AND_FILTERING.md). for more details on sorting
  
  >**ARRAY-FIELDS**\
  >Type: Array of String\
  >Specifies what properties of the a user is an array. All fields in this category are displayed as labels.
  
  >**DERIVED-FIELDS**\
  >Type: Array of String\
  >Specifies what properties of the user which are to be displayed on the table that need to be derived using the role module. These properties are usually application specific.
  
  >**USRS-TABLE-HEADER**\
  >Type: Array of String\
  >Specifies properties of the user that are required to be displayed on the table. The field name is used to name the title.\
  >While naming field, any underscore would be replaced with a space and displayed as the column name.\
  >For instance, a property of ```user_role``` would be displayed as ```'USER ROLE'``` (without the quotes).
  
  
  >**MAXIMUM-COL-WIDTH**\
  >Type: Integer\
  >Specifies the amount of text to display in a column before truncating.
  
  >**ACTIONS-PER-USER-ROLE**\
  >Type: Array of String\
  >Specifies the actions that can be performed on each user.
  
  >**CLASSES-FOR-USER-ROLE-ACTIONS**\
  >Type: Array of String\
  >Specifies classes to be assigned to each action described in the ```ACTIONS-PER-USER-ROLE``` field
  
  >**TOGGLE-FIELDS**\
  >Type: Array of Object\
  >Specifies a field that is toggle-able. Fields in this category take binary values and are displayed as ticks or crosses.\
  >Each object is defined as: ```{ name: '', positive: ''}```\
  >The ```name``` field is a string and holds the name of the field while the ```positive``` field can take any form and represents the value for this field to be considered true.
  
  >**UNSORTABLE-FIELDS**\
  >Type: Array of Strings\
  >Specifies a list of columns by which the user data presented should not be sorted by.
  
  
  
* Pagination\
Holds details on page sizing.
 
 ```
pagination: {
    pageSize: [PAGE-SIZE]
  }
```

>**PAGE-SIZE**\
>Type: Integer\
>Specifies the number of users to be displayed per page while viewing the list of users. 


