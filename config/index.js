// THese are dummy parameters. Adjust these to suite your environment when running tests
module.exports = {
  port : 1337,
  couch : {
    host: 'http://127.0.0.1',
    port: '5984',
    auth: {username: 'admin', password: 'admin'},
    allOrNothing: false,
    forceSave: false
  }
};
