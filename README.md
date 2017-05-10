# couchdb-ums



A  [UMS](https://github.com/eHealthAfrica/couchdb-ums) app for Lomis-Stock




#### Prequisites

The [LMIS-Dashboard](https://github.com/eHealthAfrica/LMIS-Dashboard) project is required to serve the app. Follow the instructions over there to set up a local server.

You will then need to modify the file `server/routes.js` by adding the following lines:

```
var ums_app =  require(path.join(config.root, 'node_modules/couchdb-user-management-app'));
app.use('/ums', ums_app([couchConfig]));
```

The couch config object is expected to be in the format stated below
```
{ 
  host: '[COUCH_DB_HOST]',
  port: '[COUCH_DB_PORT]',
  auth: { username: '[COUCH_DB_ADMIN_USERNAME]', password: '[COUCH_DB_ADMIN_PASSWORD]' }
 
}
```




#### Install and Serve

Add the following line to your package.json  dependency

```
couchdb-user-management-app": "eHealthAfrica/couchdb-user-management-app#[BRANCH_NAME]
```





### Testing

To test, update the config/index.js file with the details required to connect to couch db then run the command
```
npm test
```



Now the app can be served using `grunt serve` from the `LMIS-Dashboard` root. The application will be available at `http://localhost:9000/ums`.


