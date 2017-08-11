'use strict'

const http = require('http')
const os = require('os')
const config = require('../test/config')
const app = require('./server/app')(config)
const PORT = process.env.UMS_PORT || 3331
let access = {}
try { access = require('./access.json') } catch (e) { access = config.access }
config.couch.db = process.env.UMS_DB || 'set'
config.currentUser.url = process.env.UMS_USER_URL || 'http://localhost:3333/api/v1/users/me'
config.auth.redirectUrl = process.env.UMS_REDIRECT_URL || 'http://localhost:3000'
config.access = access

http.createServer(app)
  .listen(PORT, () => {
    console.log(`up and running @: ${os.hostname()} on port: ${PORT}`)
  })
