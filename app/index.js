'use strict'

const extend = require('extend')
const http = require('http')
const os = require('os')
const testConfig = require('../test/config')
const PORT = process.env.UMS_PORT || 3331
let configOverrides = {}
let access = {}
try { configOverrides = require('./ums-config') } catch (e) { console.log(e); configOverrides = testConfig }
try { access = require('./access.json') } catch (e) { access = testConfig.access }

const config = extend(true, testConfig, configOverrides)
config.couch.db = process.env.UMS_DB || config.couch.db || 'set'
config.currentUser.url = process.env.UMS_USER_URL || config.currentUser.url || 'http://localhost:3333/api/v1/users/me'
config.auth.redirectUrl = process.env.UMS_REDIRECT_URL || config.auth.redirectUrl || 'http://localhost:3000'
config.access = access
console.log(config)
const app = require('./server/app')(config)
http.createServer(app)
  .listen(PORT, () => {
    console.log(`up and running @: ${os.hostname()} on port: ${PORT}`)
  })
