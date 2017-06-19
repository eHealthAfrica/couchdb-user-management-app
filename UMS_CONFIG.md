Configuring the UMS
------------------

For a complelte overview of the umsConfig object, refer to here.

* Authentication

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
  > As at version 3.0.0, the only supported AUTH-TYPE IS 'cookies'
  
  >**COOKIE-NAME**\
  >Type: String\
  > This specifies the name of the cookie that stores the authentication token. 
  
  > **COOKIE-AUTH-TYPE**\
  > Type: String\
  > This specifies how the cookie value would be used. As at version 3.0.0,\ the only supported COOKIE-AUTH-TYPE is 
  > 'BEARER'. 
  
  > **REDIRECT-URL**\
  > Type: String\
  > This specifies the URL to redirect to on the event that authentication fails.
  
  
  * Authorization 
  
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
  >Specifies the value of the ACCESS-PROP field read earlier. When the read value equals the specified value, it is assumed that the user has Authorization to access the UMS. See examples below.
  
  
  > _Authorization Example_:
  > 
  >Case a:\
  > The user object has a field access_level which should have a value of 'admin' for authorized users:\
  > In this case, ACCESS-PROP would be 'access_level' while ACCESS-PROP-VALUE would be 'admin'
  >
  >Case b:\
  >The user object is defined as   
  > { name: 'alice', 
  >   app_data: { 
  >     credentials: { 
  >         role: 'basic'
  >       }
  >     }
  >  } \
  > and the required field is role which is defined in the property credentials of app_data which should have a value
  > of 'advanced' for authorized users.\
  > In this case, ACCESS-PROP would be 'app_data.credentials.role' while ACCESS-PROP-VALUE would be 'advanced'.
  
  
  * CouchDB
  
   ```
   couch: {
         host: '[COUCHDB-HOST]',
         port: [COUCHDB-PORT]',
         auth: {username: '[COUCHDB-USER NAME]', password: '[COUCHDB-PASSWORD]'},
         allOrNothing: false,
         forceSave: false
    }
    ```

  
  >
  
